import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  firstSeen: number;
  lastAttempt: number;
}

// In-memory buckets for sliding-window rate limiting
const buckets = new Map<string, Map<string, RateLimitRecord>>();

export function getClientIp(req: NextRequest): string {
  // 1. Cloudflare True-Client IP
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp && isValidIp(cfIp)) {
    return cfIp.trim();
  }

  // 2. Direct real IP
  const realIp = req.headers.get('x-real-ip');
  if (realIp && isValidIp(realIp)) {
    return realIp.trim();
  }

  // 3. X-Forwarded-For
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (isValidIp(firstIp)) {
      return firstIp;
    }
  }

  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // IPv4 regex
  const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 basic regex
  const ipv6 = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
  return ipv4.test(ip) || ipv6.test(ip) || ip === '::1';
}

export interface RateLimitConfig {
  bucketName: string;
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; count: number; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  let bucket = buckets.get(config.bucketName);
  if (!bucket) {
    bucket = new Map<string, RateLimitRecord>();
    buckets.set(config.bucketName, bucket);
  }

  const record = bucket.get(key);

  // Clean expired record or create initial
  if (!record || now - record.firstSeen > config.windowMs) {
    bucket.set(key, { count: 1, firstSeen: now, lastAttempt: now });
    return {
      allowed: true,
      count: 1,
      remaining: config.maxRequests - 1,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000)
    };
  }

  record.count += 1;
  record.lastAttempt = now;

  const retryAfterSeconds = Math.max(1, Math.ceil((record.firstSeen + config.windowMs - now) / 1000));
  const remaining = Math.max(0, config.maxRequests - record.count);

  if (record.count > config.maxRequests) {
    return {
      allowed: false,
      count: record.count,
      remaining: 0,
      retryAfterSeconds
    };
  }

  return {
    allowed: true,
    count: record.count,
    remaining,
    retryAfterSeconds
  };
}

// Preset limits
export const RATE_LIMITS = {
  LOGIN: { bucketName: 'login', maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 mins
  REGISTER: { bucketName: 'register', maxRequests: 5, windowMs: 15 * 60 * 1000 },
  ENQUIRY: { bucketName: 'enquiry', maxRequests: 5, windowMs: 60 * 1000 }, // 5 submissions per min
  DOWNLOAD: { bucketName: 'download', maxRequests: 20, windowMs: 60 * 1000 }
};
