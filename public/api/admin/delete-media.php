<?php
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Тільки POST');
require_auth();
require_csrf();

$body = json_input();
$path = (string)($body['path'] ?? '');
if ($path === '') fail(400, 'Не вказано path');

// Дозволяємо видаляти лише з uploads/ або cases/
$norm = ltrim($path, '/');
$abs = ROOT_DIR . '/' . $norm;

if (!file_exists($abs)) fail(404, 'Файл не знайдено');

$ok_in_uploads = path_inside(UPLOADS_DIR, $abs);
$ok_in_cases   = path_inside(CASES_DIR,   $abs);
if (!$ok_in_uploads && !$ok_in_cases) fail(403, 'Шлях поза дозволеними каталогами');

if (!@unlink($abs)) fail(500, 'Не вдалося видалити файл');
ok();
