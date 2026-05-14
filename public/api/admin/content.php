<?php
require __DIR__ . '/_bootstrap.php';

$ALLOWED = ['services', 'plans', 'cases', 'reviews', 'faq', 'partners', 'widget'];
$MAX = ['services' => 3, 'plans' => 3];
// Типи, які зберігаються як одиничний обʼєкт (а не масив)
$OBJECT_TYPES = ['widget'];

$type = $_GET['type'] ?? '';
if (!in_array($type, $ALLOWED, true)) fail(400, 'Невідомий type');

$file = DATA_DIR . '/' . $type . '.json';
$is_object_type = in_array($type, $OBJECT_TYPES, true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_auth();
    $data = load_json($file);
    if ($data === null) $data = $is_object_type ? new stdClass() : [];
    ok(['data' => $data]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_auth();
    require_csrf();
    $body = json_input();
    if (!array_key_exists('data', $body) || !is_array($body['data'])) fail(400, 'Очікую { data: [...] }');
    $data = $body['data'];

    if ($is_object_type) {
        // Для object-типів пропускаємо валідацію рядків
        save_json($file, $data);
        ok(['saved' => 1]);
    }

    if (isset($MAX[$type]) && count($data) > $MAX[$type]) {
        fail(422, "Для '$type' максимум " . $MAX[$type] . ' елементів');
    }

    foreach ($data as $i => $row) {
        if (!is_array($row)) fail(422, "Елемент #$i не є обʼєктом");
    }

    save_json($file, $data);
    ok(['saved' => count($data)]);
}

fail(405, 'Метод не дозволений');
