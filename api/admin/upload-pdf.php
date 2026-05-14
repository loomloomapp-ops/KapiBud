<?php
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Тільки POST');
require_auth();
require_csrf();

if (empty($_FILES['file'])) fail(400, 'Файл не отримано');

$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Помилка завантаження (' . $f['error'] . ')');

$ext = strtolower(pathinfo((string)$f['name'], PATHINFO_EXTENSION));
if ($ext !== 'pdf') fail(415, 'Дозволено лише .pdf');

$MAX_PDF = 25 * 1024 * 1024;
if ($f['size'] > $MAX_PDF) fail(413, 'PDF більше ' . round($MAX_PDF/1024/1024) . ' MB');

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string)$finfo->file($f['tmp_name']);
if ($mime !== 'application/pdf') fail(415, 'MIME не відповідає (.pdf)');

$assets_dir = ROOT_DIR . '/assets';
if (!is_dir($assets_dir)) @mkdir($assets_dir, 0775, true);

$dest = $assets_dir . '/PRIMEBUD-pricelist.pdf';

if (!move_uploaded_file($f['tmp_name'], $dest)) fail(500, 'Не вдалося зберегти PDF');
@chmod($dest, 0664);

ok([
    'url'  => '/assets/PRIMEBUD-pricelist.pdf?v=' . time(),
    'size' => filesize($dest),
]);
