"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedirect = handleRedirect;
const prisma_1 = require("../config/prisma");
const cacheService_1 = require("../services/cacheService");
const queueService_1 = require("../services/queueService");
const geoService_1 = require("../analytics/geoService");
const botDetector_1 = require("../analytics/botDetector");
const userAgentParser_1 = require("../analytics/userAgentParser");
const visitorHasher_1 = require("../analytics/visitorHasher");
const env_1 = require("../config/env");
const codeGenerator_1 = require("../utils/codeGenerator");
async function handleRedirect(req, res, next) {
    const rawCode = req.params.shortCode;
    const shortCode = (Array.isArray(rawCode) ? rawCode[0] : rawCode)?.trim();
    // Guard against reserved words if mounted on root - pass through to next route (e.g. SPA)
    if (!shortCode || (0, codeGenerator_1.isReservedSlug)(shortCode)) {
        if (typeof next === 'function') {
            return next();
        }
        handleNotFound(req, res, shortCode || 'unknown');
        return;
    }
    try {
        let link = await cacheService_1.cacheService.getLink(shortCode);
        if (!link) {
            // Look up in database
            const dbLink = await prisma_1.prisma.link.findFirst({
                where: {
                    OR: [{ shortCode }, { customAlias: shortCode }],
                },
                select: {
                    id: true,
                    originalUrl: true,
                    status: true,
                    expiresAt: true,
                    campaignId: true,
                    shortCode: true,
                },
            });
            if (!dbLink) {
                handleNotFound(req, res, shortCode);
                return;
            }
            link = {
                id: dbLink.id,
                originalUrl: dbLink.originalUrl,
                status: dbLink.status,
                expiresAt: dbLink.expiresAt ? dbLink.expiresAt.toISOString() : null,
                campaignId: dbLink.campaignId,
                shortCode: dbLink.shortCode,
            };
            // Store in cache
            await cacheService_1.cacheService.setLink(shortCode, link);
        }
        // 1. Check if BLOCKED
        if (link.status === 'BLOCKED') {
            handleBlocked(req, res, shortCode);
            return;
        }
        // 2. Check if DISABLED
        if (link.status === 'DISABLED') {
            handleDisabled(req, res, shortCode);
            return;
        }
        // 3. Check if EXPIRED
        const now = new Date();
        if (link.expiresAt && new Date(link.expiresAt) <= now) {
            handleExpired(req, res, shortCode, link.expiresAt);
            return;
        }
        // 4. Link is ACTIVE -> capture analytics and redirect
        const clientIp = (0, geoService_1.extractClientIp)(req);
        const { visitorId, ipHash } = (0, visitorHasher_1.identifyVisitor)(req, res, clientIp);
        const userAgent = req.headers['user-agent'] || '';
        const isBot = (0, botDetector_1.isBotTraffic)(userAgent);
        const { deviceType, browser, browserVersion, os, osVersion } = (0, userAgentParser_1.parseUserAgentString)(userAgent, isBot);
        const geo = (0, geoService_1.resolveGeoLocation)(req, clientIp);
        const referrer = (req.headers['referer'] || req.headers['referrer'] || '');
        // Enqueue event asynchronously
        queueService_1.queueService.enqueueAnalytics({
            linkId: link.id,
            campaignId: link.campaignId,
            visitorId,
            ipHash,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            deviceType,
            browser,
            browserVersion,
            os,
            osVersion,
            referrer: referrer || null,
            userAgent: userAgent.slice(0, 500),
            isBot,
            statusCode: 302,
            timestamp: now,
        });
        // Perform HTTP 302 redirect
        res.redirect(302, link.originalUrl);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: 'An internal error occurred while processing the redirect.',
        });
    }
}
function handleNotFound(req, res, code) {
    const acceptsHtml = req.accepts('html');
    if (acceptsHtml) {
        const errorUrl = `${env_1.env.FRONTEND_URL}/errors/not-found?code=${encodeURIComponent(code)}`;
        res.redirect(302, errorUrl);
    }
    else {
        res.status(404).json({ success: false, error: 'Short link not found', code });
    }
}
function handleBlocked(req, res, code) {
    const acceptsHtml = req.accepts('html');
    if (acceptsHtml) {
        const errorUrl = `${env_1.env.FRONTEND_URL}/errors/blocked?code=${encodeURIComponent(code)}`;
        res.redirect(302, errorUrl);
    }
    else {
        res.status(403).json({ success: false, error: 'This short link has been blocked by administrators.', code });
    }
}
function handleDisabled(req, res, code) {
    const acceptsHtml = req.accepts('html');
    if (acceptsHtml) {
        const errorUrl = `${env_1.env.FRONTEND_URL}/errors/disabled?code=${encodeURIComponent(code)}`;
        res.redirect(302, errorUrl);
    }
    else {
        res.status(410).json({ success: false, error: 'This short link has been disabled by its owner.', code });
    }
}
function handleExpired(req, res, code, expiresAt) {
    const acceptsHtml = req.accepts('html');
    if (acceptsHtml) {
        const errorUrl = `${env_1.env.FRONTEND_URL}/errors/expired?code=${encodeURIComponent(code)}&expiresAt=${encodeURIComponent(expiresAt)}`;
        res.redirect(302, errorUrl);
    }
    else {
        res.status(410).json({ success: false, error: 'This short link has expired.', code, expiresAt });
    }
}
