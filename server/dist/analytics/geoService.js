"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractClientIp = extractClientIp;
exports.resolveGeoLocation = resolveGeoLocation;
const geoip_lite_1 = __importDefault(require("geoip-lite"));
/**
 * Extracts client IP from request, taking proxy headers (Cloudflare, X-Forwarded-For) into account
 */
function extractClientIp(req) {
    const cfIp = req.headers['cf-connecting-ip'];
    if (cfIp)
        return cfIp.trim();
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        const parts = forwardedFor.split(',');
        return parts[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp)
        return realIp.trim();
    return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}
/**
 * Resolves country, region, and city from client IP and request headers
 */
function resolveGeoLocation(req, ip) {
    // Check Cloudflare or CDN country headers first
    const cfCountry = req.headers['cf-ipcountry']?.toUpperCase();
    const cfCity = req.headers['cf-ipcity'];
    const cfRegion = req.headers['cf-region'];
    if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1') {
        return {
            country: cfCountry,
            region: cfRegion || 'Unknown',
            city: cfCity || 'Unknown',
        };
    }
    // Handle local development IP addresses
    if (ip === '127.0.0.1' ||
        ip === '::1' ||
        ip === 'localhost' ||
        ip.startsWith('192.168.') ||
        ip.startsWith('10.') ||
        ip.startsWith('172.16.')) {
        return {
            country: 'Local / Development',
            region: 'Localhost',
            city: 'Local Area',
        };
    }
    // Lookup in geoip-lite
    try {
        const geo = geoip_lite_1.default.lookup(ip);
        if (geo) {
            return {
                country: geo.country || 'Unknown',
                region: geo.region || 'Unknown',
                city: geo.city || 'Unknown',
            };
        }
    }
    catch {
        // ignore
    }
    return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
    };
}
