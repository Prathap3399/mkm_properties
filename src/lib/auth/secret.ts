// Centralized cryptographically secure JWT secret manager

const DEV_FALLBACK_SECRET = 'dev_only_jwt_signing_key_never_use_in_production_32chars_min';

let cachedSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (cachedSecret) {
    return cachedSecret;
  }

  const envSecret = process.env.ADMIN_JWT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!envSecret || envSecret.trim().length === 0) {
      throw new Error(
        'CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_JWT_SECRET environment variable is not defined in production. Generate a strong key with: openssl rand -hex 32'
      );
    }
    if (envSecret.length < 32) {
      throw new Error(
        'CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_JWT_SECRET must be at least 32 characters long for production security.'
      );
    }
    cachedSecret = new TextEncoder().encode(envSecret);
    return cachedSecret;
  }

  // Development / Test mode fallback
  const effectiveSecret = envSecret && envSecret.length >= 16 ? envSecret : DEV_FALLBACK_SECRET;
  cachedSecret = new TextEncoder().encode(effectiveSecret);
  return cachedSecret;
}

