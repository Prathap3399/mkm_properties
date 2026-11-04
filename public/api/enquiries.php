<?php
/**
 * MKM Properties - Trichy
 * cPanel Apache / MySQL API Bridge for Site Visits & Enquiries
 * 
 * Works with GlobeHost Shared cPanel Hosting:
 * - Inserts directly into GlobeHost MySQL `Enquiry` table
 * - Logs audit record in `AuditLog` table
 * - Sends email notifications via PHP mail() / cPanel Webmail
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit();
}

// 1. Read Raw JSON Payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
    exit();
}

// 2. Anti-bot honeypot check
if (!empty($data['botField'])) {
    // Return fake success to bots
    echo json_encode(['success' => true, 'message' => 'Site visit enquiry received']);
    exit();
}

// 3. Extract and Validate Fields
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');

if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid full name.']);
    exit();
}

// Normalize Indian phone
$digits = preg_replace('/\D/', '', $phone);
$normalizedPhone = null;
if (strlen($digits) === 10 && preg_match('/^[6-9]\d{9}$/', $digits)) {
    $normalizedPhone = '+91' . $digits;
} elseif (strlen($digits) === 11 && str_starts_with($digits, '0') && preg_match('/^[6-9]/', substr($digits, 1))) {
    $normalizedPhone = '+91' . substr($digits, 1);
} elseif (strlen($digits) === 12 && str_starts_with($digits, '91') && preg_match('/^[6-9]/', substr($digits, 2))) {
    $normalizedPhone = '+' . $digits;
}

if (!$normalizedPhone) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid 10-digit Indian mobile number.']);
    exit();
}

$whatsapp = trim($data['whatsapp'] ?? '') ?: $normalizedPhone;
$email = trim($data['email'] ?? '') ?: null;
$purpose = trim($data['purpose'] ?? 'Build a House');
$budget = trim($data['budget'] ?? '') ?: null;
$preferredLocation = trim($data['preferredLocation'] ?? '') ?: 'General Trichy Plots';
$preferredVisitDate = trim($data['preferredVisitDate'] ?? '') ?: null;
$preferredTime = trim($data['preferredTime'] ?? '') ?: 'Morning (09:00 AM – 12:00 PM)';
$additionalRequirements = trim($data['additionalRequirements'] ?? '') ?: null;
$message = trim($data['message'] ?? '') ?: $additionalRequirements;
$projectId = trim($data['projectId'] ?? '') ?: null;
$source = 'Site Visit Form';

// Database Credentials from Environment or default GlobeHost cPanel config
$dbHost = getenv('MYSQL_HOST') ?: 'localhost';
$dbPort = getenv('MYSQL_PORT') ?: '3306';
$dbName = getenv('MYSQL_DATABASE') ?: '';
$dbUser = getenv('MYSQL_USER') ?: '';
$dbPass = getenv('MYSQL_PASSWORD') ?: '';

$enquiryId = sprintf(
    '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$nowIso = gmdate('Y-m-d\TH:i:s\Z');

// 4. Connect to MySQL Database via PDO
$dbSaved = false;
if (!empty($dbName) && !empty($dbUser)) {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        $stmt = $pdo->prepare("
            INSERT INTO Enquiry (
                id, name, phone, whatsapp, email, projectId, purpose, budget,
                preferredLocation, preferredVisitDate, preferredTime, message,
                status, source, consentAt, privacyPolicyVersion, createdAt, updatedAt
            ) VALUES (
                :id, :name, :phone, :whatsapp, :email, :projectId, :purpose, :budget,
                :preferredLocation, :preferredVisitDate, :preferredTime, :message,
                'NEW', :source, :consentAt, 'v1.0', :createdAt, :updatedAt
            )
        ");

        $stmt->execute([
            ':id' => $enquiryId,
            ':name' => $name,
            ':phone' => $normalizedPhone,
            ':whatsapp' => $whatsapp,
            ':email' => $email,
            ':projectId' => $projectId,
            ':purpose' => $purpose,
            ':budget' => $budget,
            ':preferredLocation' => $preferredLocation,
            ':preferredVisitDate' => $preferredVisitDate,
            ':preferredTime' => $preferredTime,
            ':message' => $message,
            ':source' => $source,
            ':consentAt' => $nowIso,
            ':createdAt' => $nowIso,
            ':updatedAt' => $nowIso,
        ]);

        $dbSaved = true;

        // Log audit record
        try {
            $auditStmt = $pdo->prepare("
                INSERT INTO AuditLog (id, timestamp, eventType, severity, ipAddress, details, status)
                VALUES (:id, :timestamp, 'ENQUIRY_CREATED', 'INFO', :ip, :details, 'SUCCESS')
            ");
            $auditId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0x0fff)|0x4000, mt_rand(0,0x3fff)|0x8000, mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff));
            $auditStmt->execute([
                ':id' => $auditId,
                ':timestamp' => $nowIso,
                ':ip' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
                ':details' => json_encode(['enquiryId' => $enquiryId, 'name' => $name, 'phone' => $normalizedPhone, 'location' => $preferredLocation]),
            ]);
        } catch (Exception $e) {
            // Non-fatal
        }

    } catch (PDOException $e) {
        error_log('[MKM Enquiry PHP DB Error] ' . $e->getMessage());
    }
}

// 5. Send Notification Email to MKM Management
$adminEmail = 'mkm.properties.trichy@gmail.com';
$emailSubject = "🔔 New Site Visit Request - {$name} ({$preferredLocation})";

$emailBody = "
======================================================
MKM PROPERTIES TRICHY - NEW SITE VISIT LEAD
======================================================
Lead ID: {$enquiryId}
Customer Name: {$name}
Primary Phone: {$normalizedPhone}
WhatsApp: " . ($whatsapp ?: 'Same as Phone') . "
Email: " . ($email ?: 'Not Provided') . "

SITE VISIT DETAILS:
Preferred Location: {$preferredLocation}
Preferred Visit Date: " . ($preferredVisitDate ?: 'Next Available') . "
Preferred Time Slot: {$preferredTime}
Purpose: {$purpose}
Budget Range: " . ($budget ?: 'Flexible') . "

Additional Notes:
" . ($message ?: 'None provided') . "

Submission Time: " . date('d M Y, h:i A') . " (IST)
Stored in Database: " . ($dbSaved ? 'YES (MySQL)' : 'Pending DB Sync') . "
======================================================
Advisor Contact: PRATHAP (+91 96290 48171)
Office: Cantonment, Trichy
";

$headers = "From: MKM Website Lead <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'mkmproperties.com') . ">\r\n" .
           "Reply-To: " . ($email ?: 'no-reply@mkmproperties.com') . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

@mail($adminEmail, $emailSubject, $emailBody, $headers);

// 6. Send Customer Confirmation if Email was provided
if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $custSubject = "Site Visit Confirmed - MKM Properties Trichy";
    $custBody = "Dear {$name},\n\nThank you for choosing MKM Properties Trichy!\n\nWe have received your site visit request for {$preferredLocation} on " . ($preferredVisitDate ?: 'your preferred date') . " ({$preferredTime}).\n\nOur property advisor PRATHAP will contact you shortly at {$normalizedPhone} to confirm your inspection arrangements.\n\nDirect Advisor Helpline: +91 96290 48171\nOffice Location: Cantonment, Trichy\n\nWarm regards,\nMKM Properties Team";
    $custHeaders = "From: MKM Properties <contact@" . ($_SERVER['SERVER_NAME'] ?? 'mkmproperties.com') . ">\r\n" .
                   "Reply-To: contact@" . ($_SERVER['SERVER_NAME'] ?? 'mkmproperties.com') . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
    @mail($email, $custSubject, $custBody, $custHeaders);
}

// 7. Return Clean Success Response
echo json_encode([
    'success' => true,
    'message' => 'Site visit enquiry received successfully. PRATHAP will contact you shortly.',
    'id' => $enquiryId,
    'databaseStored' => $dbSaved
]);
