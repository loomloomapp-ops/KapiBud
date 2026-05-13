<?php
require __DIR__ . '/_bootstrap.php';

if (!is_dir(CASES_DIR)) @mkdir(CASES_DIR, 0775, true);

$action = $_GET['action'] ?? '';

// Допоміжне: оновити запис кейсу у public/data/cases.json
// $mutator(&$case) — отримує посилання на елемент і змінює його (photos/videos).
function update_case_in_json(string $slug, callable $mutator): void {
    $file = DATA_DIR . '/cases.json';
    $data = load_json($file);
    if (!is_array($data)) return;
    $changed = false;
    foreach ($data as &$c) {
        if (($c['slug'] ?? '') === $slug) {
            $mutator($c);
            $changed = true;
            break;
        }
    }
    unset($c);
    if ($changed) save_json($file, $data);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list-media') {
    require_auth();
    $slug = safe_slug((string)($_GET['slug'] ?? ''));
    $dir = CASES_DIR . '/' . $slug;
    if (!is_dir($dir)) ok(['photos' => [], 'videos' => []]);
    $photos = []; $videos = [];
    foreach (scandir($dir) ?: [] as $f) {
        if ($f === '.' || $f === '..') continue;
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg','jpeg','png','webp','gif'], true)) $photos[] = $f;
        elseif (in_array($ext, ['mp4','mov','webm'], true))            $videos[] = $f;
    }
    sort($photos, SORT_NATURAL); sort($videos, SORT_NATURAL);
    ok(['photos' => $photos, 'videos' => $videos]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'upload') {
    require_auth(); require_csrf();
    $slug = safe_slug((string)($_POST['slug'] ?? ''));
    if ($slug === '' || $slug === 'item') fail(400, 'Невалідний slug кейсу');
    $dir = CASES_DIR . '/' . $slug;
    if (!is_dir($dir)) @mkdir($dir, 0775, true);

    if (empty($_FILES['file'])) fail(400, 'Файл не отримано');
    $f = $_FILES['file'];
    if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Помилка завантаження (' . $f['error'] . ')');

    $orig = $f['name'];
    $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
    $is_image = in_array($ext, ['jpg','jpeg','png','webp','gif'], true);
    $is_video = in_array($ext, ['mp4','mov','webm'], true);
    if (!$is_image && !$is_video) fail(415, 'Розширення .' . $ext . ' не дозволено');
    if ($is_image && $f['size'] > $MAX_IMG) fail(413, 'Зображення > ' . round($MAX_IMG/1024/1024) . ' MB');
    if ($is_video && $f['size'] > $MAX_VID) fail(413, 'Відео > ' . round($MAX_VID/1024/1024) . ' MB');

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($f['tmp_name']);
    if (!(($is_image && str_starts_with((string)$mime, 'image/'))
       || ($is_video && str_starts_with((string)$mime, 'video/')))) {
        fail(415, 'MIME не відповідає розширенню');
    }

    // Назва: автоперенумерування для відео (video-NN.mp4), фото — як було, з суфіксом для унікальності
    if ($is_video) {
        $next = 1;
        foreach (scandir($dir) ?: [] as $x) {
            if (preg_match('~^video-(\d+)\.~i', $x, $m)) $next = max($next, (int)$m[1] + 1);
        }
        $name = sprintf('video-%02d.%s', $next, $ext);
    } else {
        $base = safe_slug(pathinfo($orig, PATHINFO_FILENAME)) ?: 'photo';
        $name = $base . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
    }
    $dest = $dir . '/' . $name;
    if (!move_uploaded_file($f['tmp_name'], $dest)) fail(500, 'Не вдалося зберегти');
    @chmod($dest, 0664);
    clearstatcache(true, $dest);

    // Синхронізуємо cases.json — додаємо filename у photos[] або videos[]
    update_case_in_json($slug, function (&$c) use ($name, $is_image) {
        $field = $is_image ? 'photos' : 'videos';
        if (!isset($c[$field]) || !is_array($c[$field])) $c[$field] = [];
        if (!in_array($name, $c[$field], true)) $c[$field][] = $name;
    });

    ok([
        'name' => $name,
        'url'  => '/cases/' . $slug . '/' . $name,
        'type' => $is_image ? 'image' : 'video',
        'size' => filesize($dest),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete-media') {
    require_auth(); require_csrf();
    $body = json_input();
    $slug = safe_slug((string)($body['slug'] ?? ''));
    $name = basename((string)($body['name'] ?? ''));
    if ($slug === '' || $name === '') fail(400, 'Потрібні slug і name');
    $abs = CASES_DIR . '/' . $slug . '/' . $name;
    if (!file_exists($abs)) fail(404, 'Файл не знайдено');
    if (!path_inside(CASES_DIR, $abs)) fail(403, 'Шлях поза cases/');
    if (!@unlink($abs)) fail(500, 'Не вдалося видалити');

    // Видаляємо запис із cases.json у обох масивах (не знаючи типу)
    update_case_in_json($slug, function (&$c) use ($name) {
        foreach (['photos', 'videos'] as $field) {
            if (isset($c[$field]) && is_array($c[$field])) {
                $c[$field] = array_values(array_filter($c[$field], fn($x) => $x !== $name));
            }
        }
    });

    ok();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete-case') {
    require_auth(); require_csrf();
    $body = json_input();
    $slug = safe_slug((string)($body['slug'] ?? ''));
    if ($slug === '') fail(400, 'Потрібен slug');
    $dir = CASES_DIR . '/' . $slug;
    if (is_dir($dir)) {
        // Рекурсивне видалення з перевіркою sandbox
        if (!path_inside(CASES_DIR, $dir)) fail(403, 'Шлях поза cases/');
        $rii = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($rii as $f) {
            $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname());
        }
        @rmdir($dir);
    }
    ok();
}

fail(400, 'Невідомий action');
