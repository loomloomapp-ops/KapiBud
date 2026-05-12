<?php
/**
 * PrimeBud — Lead → Telegram проксі.
 *
 * Розгортання на Hostinger:
 *   1. Створи Telegram бота через @BotFather, скопіюй TOKEN.
 *   2. Дізнайся chat_id (свій або групи) — напр. через @userinfobot.
 *   3. У файлі lead.config.php (поряд із цим файлом) встанови константи:
 *        define('TELEGRAM_TOKEN', 'XXXXXXXXX:YYYYYYYYY');
 *        define('TELEGRAM_CHAT_ID', '123456789');
 *   4. Файл lead.config.php у git НЕ комітити (вже в .gitignore).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Завантаження конфігу (не в репі)
$config_path = __DIR__ . '/lead.config.php';
if (file_exists($config_path)) {
    require $config_path;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_payload']);
    exit;
}

// Honeypot / простий ан­ти-спам
if (!empty($payload['hp'])) {
    echo json_encode(['ok' => true]); // мовчки приймаємо, але не шлемо
    exit;
}

// Очистити поля
$clean = function ($s) {
    $s = is_string($s) ? trim($s) : '';
    $s = preg_replace('/[\r\n]+/u', ' ', $s);
    return mb_substr($s, 0, 500);
};

$source  = $clean($payload['source']  ?? '');
$name    = $clean($payload['name']    ?? '');
$phone   = $clean($payload['phone']   ?? '');
$obj     = $clean($payload['objectType']     ?? '');
$ch      = $clean($payload['contactChannel'] ?? '');
$msg     = $clean($payload['message'] ?? '');
$step1   = $clean($payload['step1']   ?? '');
$step2   = $clean($payload['step2']   ?? '');
$step3   = $payload['step3'] ?? [];
$ts      = $clean($payload['ts'] ?? gmdate('c'));

if (!$name && !$phone) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'empty']);
    exit;
}

// Збираємо повідомлення
$lines = ["🛠 <b>PrimeBud — нова заявка</b>"];
$lines[] = "<b>Джерело:</b> " . htmlspecialchars($source);
if ($name)  $lines[] = "<b>Імʼя:</b> "    . htmlspecialchars($name);
if ($phone) $lines[] = "<b>Телефон:</b> " . htmlspecialchars($phone);
if ($obj)   $lines[] = "<b>Обʼєкт:</b> "  . htmlspecialchars($obj);
if ($ch)    $lines[] = "<b>Звʼязок:</b> " . htmlspecialchars($ch);
if ($msg)   $lines[] = "<b>Коментар:</b> " . htmlspecialchars($msg);
if ($step1) $lines[] = "Крок1: "  . htmlspecialchars($step1);
if ($step2) $lines[] = "Крок2: "  . htmlspecialchars($step2);
if (is_array($step3) && $step3) {
    foreach ($step3 as $k => $v) {
        $lines[] = "  " . htmlspecialchars((string)$k) . ": " . htmlspecialchars((string)$v);
    }
}
$lines[] = "<i>" . htmlspecialchars($ts) . "</i>";
$text = implode("\n", $lines);

// Фолбек: якщо немає TELEGRAM_TOKEN — лог у файл
if (!defined('TELEGRAM_TOKEN') || !defined('TELEGRAM_CHAT_ID')) {
    @file_put_contents(__DIR__ . '/leads.log', $text . "\n\n", FILE_APPEND);
    echo json_encode(['ok' => true, 'logged' => true]);
    exit;
}

$url = 'https://api.telegram.org/bot' . TELEGRAM_TOKEN . '/sendMessage';
$body = http_build_query([
    'chat_id' => TELEGRAM_CHAT_ID,
    'text' => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
]);

$ch_curl = curl_init($url);
curl_setopt_array($ch_curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
$resp = curl_exec($ch_curl);
$http = curl_getinfo($ch_curl, CURLINFO_HTTP_CODE);
curl_close($ch_curl);

if ($http >= 200 && $http < 300) {
    echo json_encode(['ok' => true]);
} else {
    @file_put_contents(__DIR__ . '/leads.log', $text . "\n[TG_FAIL $http $resp]\n\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'telegram_failed']);
}
