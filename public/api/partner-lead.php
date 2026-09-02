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

/**
 * A display name in an address header, made safe to put in front of an <address>.
 *
 * Two problems the raw value has:
 *   - Header field bodies are ASCII (RFC 5322). An Arabic name written straight into
 *     Reply-To is 8-bit and arrives as mojibake, or gets the message rejected by a strict
 *     MTA. The subject is already RFC 2047 encoded; this gives the name the same
 *     treatment.
 *   - An unquoted name containing <, >, comma, semicolon or colon is address syntax. A
 *     name of `x <someone@else>` would otherwise produce two addresses in one header and
 *     send the reply somewhere the visitor chose.
 */
function headerDisplayName(string $value): string
{
    $value = headerSafe($value);

    // Printable ASCII can stay readable - quoted, so specials are literal text.
    if (preg_match('/^[\x20-\x7E]*$/', $value) === 1) {
        return '"' . str_replace(['\\', '"'], ['\\\\', '\\"'], $value) . '"';
    }

    // mb_encode_mimeheader rather than a hand-built encoded-word: RFC 2047 caps an
    // encoded-word at 75 characters, and a 120-character Arabic name base64s past that.
    // This folds it into several words correctly.
    return mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n");
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

/*
 * Honeypot. The form renders a `website` field that is hidden from sight, from assistive
 * technology and from the tab order, so a person never fills it in; a bot that fills every
 * input it finds does.
 *
 * The response is a normal success. Telling a bot it was rejected is an invitation to
 * retune and try again, and the visitor-facing states are unaffected because no real
 * submission can reach this branch.
 */
if (field($payload, 'website', MAX_FIELD_LENGTH) !== '') {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
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
    'Reply-To: ' . headerDisplayName($name) . ' <' . $email . '>',
]);

$sent = @mail(
    RECIPIENT,
    // Folded the same way as the Reply-To name: a business name long enough to push the
    // encoded subject past the RFC 2047 75-character limit is ordinary, not an edge case.
    mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n"),
    implode("\r\n", $lines),
    $headers
);

if (!$sent) {
    fail(502, 'mail_failed');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
