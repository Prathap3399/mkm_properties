-- MKM Properties - Security Audit Trail & Legacy Note Sanitization
-- Compatible with SQLite and Cloudflare D1

CREATE TABLE IF NOT EXISTS AuditLog (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    eventType TEXT NOT NULL,
    severity TEXT NOT NULL,
    actorId TEXT,
    actorEmail TEXT,
    ipAddress TEXT,
    details TEXT,
    status TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_event ON AuditLog(eventType);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON AuditLog(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON AuditLog(actorEmail);

-- Sanitize legacy follow-up notes to prevent plaintext password disclosure
UPDATE FollowUp 
SET note = 'Lead approved by Admin. Portal access activated.' 
WHERE note LIKE '%Default Password%';
