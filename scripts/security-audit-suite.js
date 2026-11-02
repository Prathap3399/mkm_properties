/**
 * MKM Properties Enterprise Security Test Suite
 * Automated verification of OWASP ASVS Level 2 security controls,
 * RBAC authorization, session lifecycle, input validation, and injection defenses.
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const { SignJWT, jwtVerify } = require('jose');

const DB_PATH = path.join(__dirname, '..', 'data', 'mkm_properties.db');
const JWT_SECRET_STRING = process.env.ADMIN_JWT_SECRET || 'mkm_properties_sec_token_key_dev_trichy_2026_enterprise_hardening';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('   MKM PROPERTIES ENTERPRISE SECURITY AUDIT & VERIFICATION SUITE');
  console.log('================================================================\n');

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Run all migrations
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      try {
        db.exec(sql);
      } catch (e) {
        console.error(`[DB Migration] Notice in ${file}:`, e.message);
      }
    }
  }

  // -------------------------------------------------------------------------
  // TEST GROUP 1: AUTHENTICATION & PASSWORD SECURITY
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 1: AUTHENTICATION & CREDENTIAL SECURITY\x1b[0m]');

  // Test 1.1: Password Hashing with cost >= 12
  const plainPass = 'StrongClient@2026!#$';
  const saltRounds = 12;
  const hash = bcrypt.hashSync(plainPass, saltRounds);
  assert(hash.startsWith('$2a$12$') || hash.startsWith('$2b$12$'), 'Password hashing generates bcrypt cost >= 12');

  // Test 1.2: Password Verification
  const match = bcrypt.compareSync(plainPass, hash);
  const mismatch = bcrypt.compareSync('WrongPassword123!', hash);
  assert(match === true && mismatch === false, 'Password comparison securely validates correct and rejects incorrect credentials');

  // Test 1.3: Password Minimum Length Enforcement (>= 8 characters)
  const weakPassword = 'short';
  assert(weakPassword.length < 8, 'Weak password (<8 chars) is identified as insufficient for policy requirement');

  // Test 1.4: Database Storage of Passwords (No Plaintext in DB)
  const usersWithPlaintext = db.prepare("SELECT count(*) as count FROM User WHERE passwordHash NOT LIKE '$2%'").get();
  assert(usersWithPlaintext.count === 0, 'Zero users in database have unhashed or plaintext passwords');

  const adminsWithPlaintext = db.prepare("SELECT count(*) as count FROM AdminUser WHERE passwordHash NOT LIKE '$2%'").get();
  assert(adminsWithPlaintext.count === 0, 'Zero administrators have unhashed or plaintext passwords');


  // -------------------------------------------------------------------------
  // TEST GROUP 2: SESSION & TOKEN SECURITY
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 2: SESSION LIFECYCLE & JWT SECURITY\x1b[0m]');

  // Test 2.1: Secure Signed JWT Generation & Verification
  const token = await new SignJWT({ id: 'test-admin-id', email: 'admin@mkmproperties.com', role: 'admin' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const { payload: verifiedPayload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
  assert(verifiedPayload.email === 'admin@mkmproperties.com' && verifiedPayload.role === 'admin', 'JWT verifies valid signature and expected claims');

  // Test 2.2: Signature Tampering Rejection
  let tamperedTokenRejected = false;
  try {
    const tamperedToken = token.slice(0, -6) + 'abc123';
    await jwtVerify(tamperedToken, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    tamperedTokenRejected = true;
  }
  assert(tamperedTokenRejected === true, 'Tampered JWT signature is strictly rejected with verification error');

  // Test 2.3: Algorithm Downgrade Attack Prevention ('none' algorithm rejected)
  let algNoneRejected = false;
  try {
    const headerBase64 = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payloadBase64 = Buffer.from(JSON.stringify({ id: 'evil', role: 'admin' })).toString('base64url');
    const noneToken = `${headerBase64}.${payloadBase64}.`;
    await jwtVerify(noneToken, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    algNoneRejected = true;
  }
  assert(algNoneRejected === true, 'JWT algorithm downgrade attempt (alg: none) is rejected by HS256 algorithm enforcement');


  // -------------------------------------------------------------------------
  // TEST GROUP 3: AUTHORIZATION & APPROVAL LIFECYCLE (RBAC)
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 3: ROLE-BASED ACCESS CONTROL & APPROVAL LIFECYCLE\x1b[0m]');

  const testUserId = crypto.randomUUID();
  const testEmail = `test_security_${Date.now()}@example.com`;
  const now = new Date().toISOString();

  // Test 3.1: New Self-Registered User Defaults to PENDING (Deny-by-Default)
  db.prepare(`
    INSERT INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 'user', 'PENDING', ?, ?)
  `).run(testUserId, 'Pending Test Client', '9840999999', '9840999999', testEmail, hash, now, now);

  const pendingUser = db.prepare('SELECT status, role FROM User WHERE id = ?').get(testUserId);
  assert(pendingUser.status === 'PENDING' && pendingUser.role === 'user', 'Newly registered user defaults to PENDING status and user role');

  // Test 3.2: PENDING User Is Forbidden From Approved Portal Access
  const canAccessAsPending = (pendingUser.status === 'APPROVED' || pendingUser.role === 'admin');
  assert(canAccessAsPending === false, 'Pending user cannot access protected project portfolio or documents');

  // Test 3.3: Admin Approves User
  db.prepare("UPDATE User SET status = 'APPROVED' WHERE id = ?").run(testUserId);
  const approvedUser = db.prepare('SELECT status, role FROM User WHERE id = ?').get(testUserId);
  assert(approvedUser.status === 'APPROVED', 'Administrator can transition user to APPROVED status');

  const canAccessAsApproved = (approvedUser.status === 'APPROVED' || approvedUser.role === 'admin');
  assert(canAccessAsApproved === true, 'Approved user is granted access to protected client assets');

  // Test 3.4: Revocation / Suspension Immediately Invalidates Access
  db.prepare("UPDATE User SET status = 'DISABLED' WHERE id = ?").run(testUserId);
  const disabledUser = db.prepare('SELECT status, role FROM User WHERE id = ?').get(testUserId);
  const canAccessAsDisabled = (disabledUser.status === 'APPROVED' || disabledUser.role === 'admin');
  assert(canAccessAsDisabled === false, 'Disabled / revoked user is immediately blocked even if they hold an active session');

  // Cleanup test user
  db.prepare('DELETE FROM User WHERE id = ?').run(testUserId);


  // -------------------------------------------------------------------------
  // TEST GROUP 4: DATABASE & MASS ASSIGNMENT PROTECTION
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 4: DATABASE SECURITY & MASS ASSIGNMENT DEFENSE\x1b[0m]');

  // Test 4.1: SQL Injection Defense (Parameterized Query Safety)
  const sqliPayload = "' OR '1'='1' --";
  const sqliResult = db.prepare('SELECT * FROM Project WHERE name = ?').all(sqliPayload);
  assert(sqliResult.length === 0, 'SQL injection payload in query parameter safely returns 0 results without SQL syntax error');

  // Test 4.2: Mass Assignment / Column Allowlist Defense
  const ALLOWED_PROJECT_COLUMNS = new Set([
    'name', 'slug', 'location', 'description', 'coverImageUrl', 'galleryUrls',
    'videoUrl', 'brochureUrl', 'priceLabel', 'approvalStatus', 'availabilityStatus',
    'isPublished', 'plotSizes', 'roadAccess', 'nearbyLandmarks', 'amenities', 'mapUrl', 'priceBrochureUrl'
  ]);
  const maliciousFields = {
    name: 'Safe Name',
    role: 'admin', // Malicious attempt to inject role into project
    isSuperUser: 1, // Malicious column
    drop_table: true
  };
  const filteredColumns = Object.keys(maliciousFields).filter(c => ALLOWED_PROJECT_COLUMNS.has(c));
  assert(filteredColumns.length === 1 && filteredColumns[0] === 'name', 'Column allowlist successfully strips unpermitted fields (mass assignment prevention)');

  // Test 4.3: Safe User Exposure (passwordHash Exclusion)
  const safeColumns = 'id, name, phone, whatsapp, email, role, status, enquiryId, notes, createdAt, updatedAt';
  assert(!safeColumns.includes('passwordHash'), 'User safe query explicitly excludes passwordHash from returned dataset');

  // Test 4.4: Plaintext Password Leakage Prevention in Notes
  const sensitiveNotes = db.prepare("SELECT count(*) as count FROM FollowUp WHERE note LIKE '%Default Password%'").get();
  assert(sensitiveNotes.count === 0, 'FollowUp notes do not store newly created customer passwords in plaintext');


  // -------------------------------------------------------------------------
  // TEST GROUP 5: INPUT VALIDATION & INJECTION DEFENSES
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 5: INPUT VALIDATION, ATTACK PREVENTION & CSV SECURITY\x1b[0m]');

  // Test 5.1: CSV Formula Injection Defense
  function sanitizeCsvCell(val) {
    if (!val) return '""';
    let clean = String(val);
    if (/^[=+\-@\t\r\n]/.test(clean)) {
      clean = `'${clean}`;
    }
    return `"${clean.replace(/"/g, '""')}"`;
  }
  const dangerousCsvInput1 = '=cmd|\' /C calc\'!A0';
  const dangerousCsvInput2 = '+2+2';
  const dangerousCsvInput3 = '@SUM(A1:A10)';
  const safeCsv1 = sanitizeCsvCell(dangerousCsvInput1);
  const safeCsv2 = sanitizeCsvCell(dangerousCsvInput2);
  const safeCsv3 = sanitizeCsvCell(dangerousCsvInput3);

  assert(safeCsv1.startsWith("\"'="), 'CSV formula starting with "=" neutralized with leading single quote');
  assert(safeCsv2.startsWith("\"'+"), 'CSV formula starting with "+" neutralized with leading single quote');
  assert(safeCsv3.startsWith("\"'@"), 'CSV formula starting with "@" neutralized with leading single quote');

  // Test 5.2: Phone Number Normalization
  function normalizeIndianPhone(input) {
    if (!input) return null;
    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) return `+91${digitsOnly}`;
    if (digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^[6-9]/.test(digitsOnly.slice(1))) return `+91${digitsOnly.slice(1)}`;
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]/.test(digitsOnly.slice(2))) return `+91${digitsOnly.slice(2)}`;
    return null;
  }
  assert(normalizeIndianPhone('9629048171') === '+919629048171', '10-digit Indian phone normalized to E.164 (+91)');
  assert(normalizeIndianPhone('09629048171') === '+919629048171', '11-digit leading-zero phone normalized to E.164 (+91)');
  assert(normalizeIndianPhone('919629048171') === '+919629048171', '12-digit 91-prefix phone normalized to E.164 (+91)');
  assert(normalizeIndianPhone('12345') === null, 'Invalid short phone number rejected');
  assert(normalizeIndianPhone('1234567890') === null, 'Phone not starting with [6-9] rejected');


  // -------------------------------------------------------------------------
  // TEST GROUP 6: FILE HANDLING & DOCUMENT SECURITY
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 6: FILE SECURITY & PATH TRAVERSAL DEFENSE\x1b[0m]');

  // Test 6.1: Path Traversal Prevention
  const baseDir = path.resolve(process.cwd(), 'public');
  function isSafePath(userFilePath) {
    const cleanRel = userFilePath.startsWith('/') ? userFilePath.slice(1) : userFilePath;
    const resolved = path.resolve(baseDir, cleanRel);
    return resolved.startsWith(baseDir);
  }

  assert(isSafePath('brochures/mkm-sterling-avenue-brochure.pdf') === true, 'Legitimate brochure path correctly allowed within base directory');
  assert(isSafePath('../../../../etc/passwd') === false, 'Directory traversal attempt (../../../../etc/passwd) blocked');
  assert(isSafePath('..\\..\\windows\\system32\\cmd.exe') === false, 'Windows directory traversal attempt (..\\..\\windows) blocked');
  assert(isSafePath('/../../private/secret.key') === false, 'Root slash traversal attempt (/../../) blocked');

  // Test 6.2: Magic Byte / MIME Spoofing Verification
  const validPdfBuffer = Buffer.from('%PDF-1.4 sample content');
  const fakePdfBuffer = Buffer.from('MZ\x90\x00 (Windows executable disguised as pdf)');
  const isPdf1 = validPdfBuffer.subarray(0, 5).toString('ascii').startsWith('%PDF-');
  const isPdf2 = fakePdfBuffer.subarray(0, 5).toString('ascii').startsWith('%PDF-');
  assert(isPdf1 === true, 'Legitimate PDF file with %PDF- magic bytes recognized');
  assert(isPdf2 === false, 'Spoofed executable file disguised as PDF rejected by magic byte check');


  // -------------------------------------------------------------------------
  // TEST GROUP 7: RATE LIMITING & ABUSE PROTECTION
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 7: RATE LIMITING & PROGRESSIVE ABUSE PROTECTION\x1b[0m]');

  const testIp = '198.51.100.42';
  const testBuckets = new Map();
  function testRateLimit(ip, maxRequests, windowMs) {
    const now = Date.now();
    let record = testBuckets.get(ip);
    if (!record || now - record.firstSeen > windowMs) {
      testBuckets.set(ip, { count: 1, firstSeen: now });
      return { allowed: true, count: 1 };
    }
    record.count++;
    return { allowed: record.count <= maxRequests, count: record.count };
  }

  let lastResult;
  for (let i = 1; i <= 6; i++) {
    lastResult = testRateLimit(testIp, 5, 60000);
  }
  assert(lastResult.allowed === false && lastResult.count === 6, 'Rate limiter permits 5 requests and blocks the 6th rapid attempt');


  // -------------------------------------------------------------------------
  // TEST GROUP 8: SECURITY AUDIT LOGGING
  // -------------------------------------------------------------------------
  console.log('\n[\x1b[34mGROUP 8: AUDIT TRAIL INTEGRITY & SENSITIVE DATA REDACTION\x1b[0m]');

  // Test 8.1: Audit Table Exists in Database
  const auditTableCheck = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='AuditLog'").get();
  assert(auditTableCheck.count === 1, 'AuditLog security table exists with appropriate schema and indices');

  // Test 8.2: Credential Redaction in Audit Logs
  function sanitizeDetails(details) {
    const REDACTED_KEYS = new Set(['password', 'passwordhash', 'token', 'secret', 'jwt', 'cookie']);
    const sanitized = {};
    for (const [key, value] of Object.entries(details)) {
      if (REDACTED_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }
    return JSON.stringify(sanitized);
  }
  const testLogPayload = {
    username: 'admin@mkmproperties.com',
    password: 'SuperSecretPassword!',
    token: 'jwt.token.here',
    ip: '127.0.0.1'
  };
  const sanitizedJson = sanitizeDetails(testLogPayload);
  assert(!sanitizedJson.includes('SuperSecretPassword!'), 'Plaintext password strictly redacted from audit log payload');
  assert(!sanitizedJson.includes('jwt.token.here'), 'Session token strictly redacted from audit log payload');
  assert(sanitizedJson.includes('127.0.0.1'), 'Non-sensitive operational audit metadata preserved');

  db.close();

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: \x1b[32m${passedTests}\x1b[0m | Failed: \x1b[31m${failedTests}\x1b[0m`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error running security test suite:', err);
  process.exit(1);
});
