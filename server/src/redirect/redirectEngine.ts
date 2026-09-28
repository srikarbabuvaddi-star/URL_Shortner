import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { cacheService, CachedLinkData } from '../services/cacheService';
import { queueService } from '../services/queueService';
import { extractClientIp, resolveGeoLocation } from '../analytics/geoService';
import { isBotTraffic } from '../analytics/botDetector';
import { parseUserAgentString } from '../analytics/userAgentParser';
import { identifyVisitor } from '../analytics/visitorHasher';
import { env } from '../config/env';
import { isReservedSlug } from '../utils/codeGenerator';

export async function handleRedirect(req: Request, res: Response, next?: any): Promise<void> {
  const rawCode = req.params.shortCode;
  const shortCode = (Array.isArray(rawCode) ? rawCode[0] : rawCode)?.trim();

  // Guard against reserved words if mounted on root - pass through to next route (e.g. SPA)
  if (!shortCode || isReservedSlug(shortCode)) {
    if (typeof next === 'function') {
      return next();
    }
    handleNotFound(req, res, shortCode || 'unknown');
    return;
  }

  try {
    let link: CachedLinkData | null = await cacheService.getLink(shortCode);

    if (!link) {
      // Look up in database
      const dbLink = await prisma.link.findFirst({
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
      await cacheService.setLink(shortCode, link);
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
    const clientIp = extractClientIp(req);
    const { visitorId, ipHash } = identifyVisitor(req, res, clientIp);
    const userAgent = req.headers['user-agent'] || '';
    const isBot = isBotTraffic(userAgent);
    const { deviceType, browser, browserVersion, os, osVersion } = parseUserAgentString(userAgent, isBot);
    const geo = resolveGeoLocation(req, clientIp);
    const referrer = (req.headers['referer'] || req.headers['referrer'] || '') as string;

    // Enqueue event asynchronously
    queueService.enqueueAnalytics({
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the redirect.',
    });
  }
}

function handleNotFound(req: Request, res: Response, code: string) {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    const errorUrl = `${env.FRONTEND_URL}/errors/not-found?code=${encodeURIComponent(code)}`;
    res.redirect(302, errorUrl);
  } else {
    res.status(404).json({ success: false, error: 'Short link not found', code });
  }
}

function handleBlocked(req: Request, res: Response, code: string) {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    const errorUrl = `${env.FRONTEND_URL}/errors/blocked?code=${encodeURIComponent(code)}`;
    res.redirect(302, errorUrl);
  } else {
    res.status(403).json({ success: false, error: 'This short link has been blocked by administrators.', code });
  }
}

function handleDisabled(req: Request, res: Response, code: string) {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    const errorUrl = `${env.FRONTEND_URL}/errors/disabled?code=${encodeURIComponent(code)}`;
    res.redirect(302, errorUrl);
  } else {
    res.status(410).json({ success: false, error: 'This short link has been disabled by its owner.', code });
  }
}

function handleExpired(req: Request, res: Response, code: string, expiresAt: string) {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml) {
    const errorUrl = `${env.FRONTEND_URL}/errors/expired?code=${encodeURIComponent(code)}&expiresAt=${encodeURIComponent(expiresAt)}`;
    res.redirect(302, errorUrl);
  } else {
    res.status(410).json({ success: false, error: 'This short link has expired.', code, expiresAt });
  }
}
