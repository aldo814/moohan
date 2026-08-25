<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const RECIPIENT_EMAIL = 'info@mttrans.co.kr';
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function input(string $key, int $maxLength = 2000): string
{
    $value = trim((string)($_POST[$key] ?? ''));
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength)
        : substr($value, 0, $maxLength);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Only POST requests are allowed.');
}

$firstName = input('firstName', 100);
$lastName = input('lastName', 100);
$company = input('company', 200);
$email = input('email', 254);
$phone = input('phone', 100);
$message = input('message', 10000);

if ($firstName === '' || $lastName === '' || $email === '' || $message === '') {
    respond(422, false, 'Please complete all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    respond(422, false, 'Please enter a valid email address.');
}

$subject = '[Moohan Website] Contact from ' . $firstName . ' ' . $lastName;
$textBody = implode("\r\n", [
    'First Name: ' . $firstName,
    'Last Name: ' . $lastName,
    'Company: ' . $company,
    'Email: ' . $email,
    'Phone: ' . $phone,
    '',
    'Message:',
    $message,
]);

$boundary = '=_Moohan_' . bin2hex(random_bytes(16));
$headers = [
    'MIME-Version: 1.0',
    'From: Moohan Website <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>',
    'Reply-To: ' . $email,
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];

$body = '--' . $boundary . "\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $textBody . "\r\n";

if (isset($_FILES['attachments'])) {
    $files = $_FILES['attachments'];
    $fileCount = is_array($files['name']) ? count($files['name']) : 0;

    for ($index = 0; $index < $fileCount; $index++) {
        $error = (int)$files['error'][$index];
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            respond(422, false, 'One or more attachments could not be uploaded.');
        }
        if ((int)$files['size'][$index] > MAX_ATTACHMENT_SIZE) {
            respond(413, false, 'Each attachment must be 10 MB or smaller.');
        }

        $fileName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename((string)$files['name'][$index]));
        $temporaryName = (string)$files['tmp_name'][$index];
        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($temporaryName) ?: 'application/octet-stream';
        $fileContent = chunk_split(base64_encode((string)file_get_contents($temporaryName)));

        $body .= '--' . $boundary . "\r\n";
        $body .= 'Content-Type: ' . $mimeType . '; name="' . $fileName . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= 'Content-Disposition: attachment; filename="' . $fileName . "\"\r\n\r\n";
        $body .= $fileContent . "\r\n";
    }
}

$body .= '--' . $boundary . "--\r\n";

if (!mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers))) {
    respond(500, false, 'The server could not send the email.');
}

respond(200, true, 'Your inquiry has been sent successfully.');
