<?php
/**
 * Partnership enquiry handler for the static Vitadiet site.
 *
 * The site is prerendered and served by Apache, so there is no Node runtime to receive
 * the form. This handler is the transport the form posts to; it validates the payload
 * again on the server (client validation is a convenience, never a guarantee) and mails
 * the enquiry to the single approved business address.
 *
 * Contract with app/services/partner-lead.ts:
 *   - 200 + {"ok":true}                 -> success state
 *   - any other status, or a non-JSON   -> server error state
 *   - request never completes           -> network error state (handled in the browser)
 *
 * To move to a CRM instead, point NUXT_PUBLIC_PARTNER_FORM_ENDPOINT at the new URL and
 * leave this file in place or delete it. See docs/PARTNER-FORM.md.
 */

declare(strict_types=1);

// The one approved recipient. Keep in sync with CONTACT.email in shared/brand.ts.
const RECIPIENT = 'acc@vitadiet.sa';
const SITE_HOST = 'www.vitadiet.sa';
const MAX_BODY_BYTES = 20000;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_FIELD_LENGTH = 120;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function fail(int $status, string $reason): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'reason' => $reason], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'method_not_allowed');
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > MAX_BODY_BYTES) {
    fail(400, 'invalid_body');
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    fail(400, 'invalid_json');
}

/** Trimmed scalar string, with control characters removed. */
function field(array $payload, string $key, int $maxLength): string
{
    $value = $payload[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr(trim($value), 0, $maxLength);
}

/**
 * Anything that reaches a mail header must not be able to start a new one. CR and LF are
 * the whole attack, so they are stripped rather than escaped.
 */
function headerSafe(string $value): string
{
    return str_replace(["\r", "\n"], ' ', $value);
}

$name = field($payload, 'name', MAX_FIELD_LENGTH);
$facilityName = field($payload, 'facilityName', MAX_FIELD_LENGTH);
$facilityType = field($payload, 'facilityType', MAX_FIELD_LENGTH);
$city = field($payload, 'city', MAX_FIELD_LENGTH);
$email = field($payload, 'email', MAX_FIELD_LENGTH);
$phone = field($payload, 'phone', MAX_FIELD_LENGTH);
$partnershipType = field($payload, 'partnershipType', MAX_FIELD_LENGTH);
$message = field($payload, 'message', MAX_MESSAGE_LENGTH);
$locale = field($payload, 'locale', 8);
$sourceUrl = field($payload, 'sourceUrl', 300);
$consent = ($payload['consent'] ?? false) === true;

$interested = [];
if (isset($payload['interestedProducts']) && is_array($payload['interestedProducts'])) {
    foreach (array_slice($payload['interestedProducts'], 0, 20) as $slug) {
        if (is_string($slug) && preg_match('/^[a-z0-9-]{1,40}$/', $slug) === 1) {
            $interested[] = $slug;
        }
    }
}

$phoneDigits = preg_replace('/\D/', '', $phone) ?? '';

$invalid = $name === ''
    || $facilityName === ''
    || $facilityType === ''
    || $city === ''
    || $partnershipType === ''
    || $message === ''
    || !$consent
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || strlen($phoneDigits) < 9
    || strlen($phoneDigits) > 15;

if ($invalid) {
    fail(422, 'validation_failed');
}

$lines = [
    'Vitadiet partnership enquiry',
    '',
    'Name: ' . $name,
    'Business: ' . $facilityName,
    'Business type: ' . $facilityType,
    'City: ' . $city,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Partnership type: ' . $partnershipType,
    'Products of interest: ' . ($interested === [] ? '-' : implode(', ', $interested)),
    'Language: ' . ($locale === '' ? '-' : $locale),
    'Sent from: ' . ($sourceUrl === '' ? '-' : $sourceUrl),
    'Privacy consent: yes',
    '',
    'Message:',
    $message,
];

$subject = '[VITADIET B2B] ' . headerSafe($facilityName !== '' ? $facilityName : $name);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    // Envelope sender stays on our own domain so SPF/DKIM keep passing; the visitor's
    // address goes on Reply-To, where replying to the enquiry actually needs it.
    'From: Vitadiet Website <no-reply@' . SITE_HOST . '>',
    'Reply-To: ' . headerSafe($name) . ' <' . headerSafe($email) . '>',
]);

$sent = @mail(
    RECIPIENT,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    implode("\r\n", $lines),
    $headers
);

if (!$sent) {
    fail(502, 'mail_failed');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
