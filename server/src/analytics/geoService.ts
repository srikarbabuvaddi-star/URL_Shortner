import geoip from 'geoip-lite';
import { Request } from 'express';

export interface GeoLocationData {
  country: string;
  region: string;
  city: string;
}

/**
 * Extracts client IP from request, taking proxy headers (Cloudflare, X-Forwarded-For) into account
 */
export function extractClientIp(req: Request): string {
  const cfIp = req.headers['cf-connecting-ip'] as string;
  if (cfIp) return cfIp.trim();

  const forwardedFor = req.headers['x-forwarded-for'] as string;
  if (forwardedFor) {
    const parts = forwardedFor.split(',');
    return parts[0].trim();
  }

  const realIp = req.headers['x-real-ip'] as string;
  if (realIp) return realIp.trim();

  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

/**
 * Resolves country, region, and city from client IP and request headers
 */
export function resolveGeoLocation(req: Request, ip: string): GeoLocationData {
  // Check Cloudflare or CDN country headers first
  const cfCountry = (req.headers['cf-ipcountry'] as string)?.toUpperCase();
  const cfCity = req.headers['cf-ipcity'] as string;
  const cfRegion = req.headers['cf-region'] as string;

  if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1') {
    return {
      country: cfCountry,
      region: cfRegion || 'Unknown',
      city: cfCity || 'Unknown',
    };
  }

  // Handle local development IP addresses
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.')
  ) {
    return {
      country: 'Local / Development',
      region: 'Localhost',
      city: 'Local Area',
    };
  }

  // Lookup in geoip-lite
  try {
    const geo = geoip.lookup(ip);
    if (geo) {
      return {
        country: geo.country || 'Unknown',
        region: geo.region || 'Unknown',
        city: geo.city || 'Unknown',
      };
    }
  } catch {
    // ignore
  }

  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
  };
}
