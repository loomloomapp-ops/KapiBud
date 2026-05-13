<?php
require __DIR__ . '/_bootstrap.php';

$ALLOWED = ['services', 'plans', 'cases', 'reviews', 'faq', 'partners'];
$MAX = ['services' => 3, 'plans' => 3];

$type = $_GET['type'] ?? '';
if (!in_array($type, $ALLOWED, true)) fail(400, 'Невідомий type');

$file = DATA_DIR . '/' . $type . '.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // публічний GET не потрібен — фронт читає прямо /data/*.json. Тут лише авторизований.
    require_auth();
    $data = load_json($file);
    if ($data === null) $data = [];
    ok(['data' => $data]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_auth();
    require_csrf();
    $body = json_input();
    if (!isset($body['data']) || !is_array($body['data'])) fail(400, 'Очікую { data: [...] }');
    $data = $body['data'];

    if (isset($MAX[$type]) && count($data) > $MAX[$type]) {
        fail(422, "Для '$type' максимум " . $MAX[$type] . ' елементів');
    }

    // Базова валідація форми кожного типу (структура мінімальна, щоб не приймати сміття)
    foreach ($data as $i => $row) {
        if (!is_array($row)) fail(422, "Елемент #$i не є обʼєктом");
    }

    save_json($file, $data);
    ok(['saved' => count($data)]);
}

fail(405, 'Метод не дозволений');
