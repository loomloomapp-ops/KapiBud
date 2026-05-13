<?php
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Тільки POST');

$body = json_input();
$user = trim((string)($body['user'] ?? ''));
$pass = (string)($body['pass'] ?? '');
if ($user === '' || $pass === '') fail(400, 'Введіть логін і пароль');

// Невелика затримка проти бруту
usleep(300_000);

if ($user !== $CONFIG['user'] || !password_verify($pass, $CONFIG['pass_hash'])) {
    fail(401, 'Невірний логін або пароль');
}

session_regenerate_id(true);
$_SESSION['admin_user'] = $user;
csrf_token();

ok(['user' => $user, 'csrf' => $_SESSION['csrf']]);
