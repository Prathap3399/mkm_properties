import { getDatabase } from '@/lib/db';
import crypto from 'crypto';

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_REGISTER'
  | 'USER_STATUS_CHANGE'
  | 'USER_ROLE_CHANGE'
  | 'LEAD_APPROVED'
  | 'DOCUMENT_DOWNLOAD'
  | 'ACCESS_DENIED'
  | 'RATE_LIMIT_TRIGGERED'
  | 'SQL_INJECTION_BLOCKED'
  | 'UNAUTHORIZED_FILE_ACCESS'
  | 'FILE_UPLOAD_BLOCKED'
  | 'ENQUIRY_CREATED';

export type SecuritySeverity = 'INFO' | 'WARN' | 'CRITICAL';

export interface SecurityEventOptions {
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  actorId?: string | null;
  actorEmail?: string | null;
  ipAddress?: string | null;
  details?: Record<string, any>;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
}

let tableInitialized = false;

async function ensureAuditTableExists() {
  if (tableInitialized) return;
  try {
    const db = getDatabase();
    await db.exec(`
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
    `);
    tableInitialized = true;
  } catch (err: any) {
    console.error('[Security Audit] Failed to initialize audit table:', err.message);
  }
}

// Sanitizes objects to prevent any inadvertent credential or token leakage in logs
function sanitizeDetails(details?: Record<string, any>): string {
  if (!details) return '{}';
  const sanitized: Record<string, any> = {};
  const REDACTED_KEYS = new Set([
    'password',
    'passwordhash',
    'token',
    'secret',
    'jwt',
    'cookie',
    'authorization',
    'admin_jwt_secret',
    'resend_api_key'
  ]);

  for (const [key, value] of Object.entries(details)) {
    if (REDACTED_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[OBJECT]';
    } else {
      sanitized[key] = value;
    }
  }

  return JSON.stringify(sanitized);
}

export async function logSecurityEvent(event: SecurityEventOptions): Promise<void> {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();
  const safeDetails = sanitizeDetails(event.details);

  // Standard secure structured console logging
  const logPrefix = `[SECURITY AUDIT] [${event.severity}] [${event.eventType}]`;
  const logPayload = {
    id,
    timestamp,
    status: event.status,
    actor: event.actorEmail || event.actorId || 'anonymous',
    ip: event.ipAddress || 'unknown',
    details: safeDetails
  };

  if (event.severity === 'CRITICAL') {
    console.error(logPrefix, JSON.stringify(logPayload));
  } else if (event.severity === 'WARN') {
    console.warn(logPrefix, JSON.stringify(logPayload));
  } else {
    console.info(logPrefix, JSON.stringify(logPayload));
  }

  // Persist to database if available
  try {
    await ensureAuditTableExists();
    const db = getDatabase();
    await db.run(
      `INSERT INTO AuditLog (id, timestamp, eventType, severity, actorId, actorEmail, ipAddress, details, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        timestamp,
        event.eventType,
        event.severity,
        event.actorId || null,
        event.actorEmail || null,
        event.ipAddress || null,
        safeDetails,
        event.status
      ]
    );
  } catch (err: any) {
    console.error('[Security Audit] Failed to write to audit log database:', err.message);
  }
}
