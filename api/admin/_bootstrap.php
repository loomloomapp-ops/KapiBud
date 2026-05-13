<?php
declare(strict_types=1);

// Спільний bootstrap для всіх admin-ендпойнтів.
// Викликати першим рядком після <?php у кожному файлі.

// Жорсткі secure-defaults для сесійних кук
$is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ($_SERVER['SERVER_PORT'] ?? '') === '443';

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => $is_https,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_name('PRIMEBUD_ADMIN');
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// Шляхи
define('ROOT_DIR',    realpath(__DIR__ . '/../..'));            // public/
define('DATA_DIR',    ROOT_DIR . '/data');
define('UPLOADS_DIR', ROOT_DIR . '/uploads');
define('CASES_DIR',   ROOT_DIR . '/cases');
define('CONFIG_FILE', __DIR__ . '/admin.config.php');

if (!is_dir(DATA_DIR))    @mkdir(DATA_DIR, 0775, true);
if (!is_dir(UPLOADS_DIR)) @mkdir(UPLOADS_DIR, 0775, true);

// Завантажуємо конфіг (логін/хеш пароля)
$CONFIG = file_exists(CONFIG_FILE) ? require CONFIG_FILE : null;
if (!is_array($CONFIG) || empty($CONFIG['user']) || empty($CONFIG['pass_hash'])) {
    http_response_code(500);
    echo json_encode([
        'error' => 'admin.config.php відсутній або некоректний. Створіть його за прикладом admin.config.example.php.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Розміри аплоадів
$MAX_IMG = (int)($CONFIG['max_image_mb'] ?? 10) * 1024 * 1024;
$MAX_VID = (int)($CONFIG['max_video_mb'] ?? 80) * 1024 * 1024;

function json_input(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

function fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['error' => $msg], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function ok(array $payload = []): void {
    echo json_encode(array_merge(['ok' => true], $payload), JSON_UNESCAPED_UNICODE);
    exit;
}

function require_auth(): void {
    if (empty($_SESSION['admin_user'])) fail(401, 'Не авторизовано');
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf'];
}

function require_csrf(): void {
    $hdr = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$hdr || !hash_equals($_SESSION['csrf'] ?? '', $hdr)) {
        fail(403, 'Невалідний CSRF-токен');
    }
}

// Атомарний запис JSON-файлу (tmp + rename)
function save_json(string $path, $data): void {
    $dir = dirname($path);
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false) fail(500, 'Не вдалося серіалізувати JSON');
    if (file_put_contents($tmp, $json, LOCK_EX) === false) fail(500, 'Помилка запису ' . basename($path));
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        fail(500, 'Помилка rename для ' . basename($path));
    }
    @chmod($path, 0664);
}

function load_json(string $path) {
    if (!file_exists($path)) return null;
    $raw = file_get_contents($path);
    $d = json_decode($raw, true);
    return $d;
}

// Перевірка: шлях лежить всередині дозволеної базової папки
function path_inside(string $base, string $target): bool {
    $rb = realpath($base);
    $rt = realpath($target);
    if ($rb === false || $rt === false) return false;
    return strncmp($rt, $rb . DIRECTORY_SEPARATOR, strlen($rb) + 1) === 0;
}

// Slug: a-z 0-9 і дефіс
function safe_slug(string $s): string {
    $s = mb_strtolower($s, 'UTF-8');
    $s = preg_replace('~[^a-z0-9\-]+~u', '-', $s) ?? '';
    $s = trim($s, '-');
    $s = preg_replace('~-+~', '-', $s) ?? '';
    return $s === '' ? 'item' : $s;
}
