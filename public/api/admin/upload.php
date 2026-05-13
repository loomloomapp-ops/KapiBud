<?php
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Тільки POST');
require_auth();
require_csrf();

if (empty($_FILES['file'])) fail(400, 'Файл не отримано');

$folder = (string)($_GET['folder'] ?? $_POST['folder'] ?? '');
// Дозволяємо лише підпапки в межах uploads/
// Очікувані варіанти: cases/<slug>, plans, reviews, partners
if ($folder === '' || !preg_match('~^[a-z0-9][a-z0-9/_-]*$~i', $folder)) {
    fail(400, 'Невалідна папка');
}

$dest_dir = UPLOADS_DIR . '/' . $folder;
if (!is_dir($dest_dir)) @mkdir($dest_dir, 0775, true);

$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Помилка завантаження (' . $f['error'] . ')');

$orig = $f['name'];
$ext  = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
$ALLOWED_IMG = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
$ALLOWED_VID = ['mp4', 'mov', 'webm'];

$is_image = in_array($ext, $ALLOWED_IMG, true);
$is_video = in_array($ext, $ALLOWED_VID, true);
$is_svg   = $ext === 'svg';
if (!$is_image && !$is_video) fail(415, 'Розширення не дозволено: .' . $ext);

if ($is_image && $f['size'] > $MAX_IMG) fail(413, 'Зображення більше дозволеного (' . round($MAX_IMG/1024/1024) . ' MB)');
if ($is_video && $f['size'] > $MAX_VID) fail(413, 'Відео більше дозволеного (' . round($MAX_VID/1024/1024) . ' MB)');

// MIME перевірка. SVG — окремо (текстовий формат, finfo часто визначає як text/xml або image/svg+xml).
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string)$finfo->file($f['tmp_name']);
if ($is_svg) {
    $mime_ok = in_array($mime, ['image/svg+xml', 'image/svg', 'text/xml', 'application/xml', 'text/plain', 'text/html'], true);
    if ($mime_ok) {
        // Захист від JS у SVG: відхиляємо <script>, on*-handlers, javascript:
        $head = (string)file_get_contents($f['tmp_name'], false, null, 0, 16384);
        if (stripos($head, '<script') !== false
            || preg_match('~\son\w+\s*=~i', $head)
            || stripos($head, 'javascript:') !== false) {
            fail(415, 'SVG містить скрипти — відхилено');
        }
    }
} else {
    $mime_ok = ($is_image && str_starts_with($mime, 'image/'))
            || ($is_video && str_starts_with($mime, 'video/'));
}
if (!$mime_ok) fail(415, 'MIME не відповідає розширенню');

$base = pathinfo($orig, PATHINFO_FILENAME);
$base = safe_slug($base) ?: 'file';
$name = $base . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = $dest_dir . '/' . $name;

if (!move_uploaded_file($f['tmp_name'], $dest)) fail(500, 'Не вдалося зберегти файл');
@chmod($dest, 0664);

$rel = '/uploads/' . $folder . '/' . $name;
ok([
    'url'  => $rel,
    'name' => $name,
    'size' => filesize($dest),
    'type' => $is_image ? 'image' : 'video',
]);
