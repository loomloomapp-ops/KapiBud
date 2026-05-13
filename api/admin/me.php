<?php
require __DIR__ . '/_bootstrap.php';
if (empty($_SESSION['admin_user'])) {
    ok(['authenticated' => false]);
}
ok([
    'authenticated' => true,
    'user' => $_SESSION['admin_user'],
    'csrf' => csrf_token(),
]);
