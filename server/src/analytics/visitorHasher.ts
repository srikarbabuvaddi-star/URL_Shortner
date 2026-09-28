import crypto from 'crypto';
import { Request, Response } from 'express';
import { env } from '../config/env';

const COOKIE_NAME = 'lp_vid';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export interface VisitorIdentification {
  visitorId: string;
  ipHash: string;
  isNewVisitor: boolean;
}

/**
 * Creates a privacy-preserving hash of an IP address using HMAC-SHA256 with the secret salt
 */
export function hashIpAddress(ip: string): string {
  return crypto
    .createHmac('sha256', env.ANALYTICS_HASH_SECRET)
    .update(ip)
    .digest('hex')
    .slice(0, 32); // 32 chars truncated hash
}

/**
 * Resolves visitor ID from cookie or generates a new privacy-conscious visitor identifier
 */
export function identifyVisitor(req: Request, res?: Response, ip = '127.0.0.1'): VisitorIdentification {
  const ipHash = hashIpAddress(ip);

  // Check if visitor ID cookie exists
  let visitorId = req.cookies?.[COOKIE_NAME];
  let isNewVisitor = false;

  if (!visitorId || typeof visitorId !== 'string' || visitorId.length < 8) {
    // Generate new unique visitor ID
    visitorId = crypto.randomUUID();
    isNewVisitor = true;

    // Attach cookie if response object is available
    if (res && typeof res.cookie === 'function') {
      res.cookie(COOKIE_NAME, visitorId, {
        maxAge: ONE_YEAR_MS,
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }
  }

  return {
    visitorId,
    ipHash,
    isNewVisitor,
  };
}
