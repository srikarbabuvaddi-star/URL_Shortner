import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/src/app';
import { prisma } from '../server/src/config/prisma';
import { queueService } from '../server/src/services/queueService';

const app = createApp();

describe('Redirect Engine & Analytics Ingestion Suite', () => {
  let activeCode = 'insta01';
  let disabledCode = 'pauseme';
  let expiredCode = 'oldfest25';

  it('should redirect active short link with HTTP 302 to destination URL', async () => {
    const res = await request(app)
      .get(`/${activeCode}`)
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15')
      .set('Referer', 'https://www.instagram.com');

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://example.com/events/tech-fest-2026');

    // Wait and drain queue to persist analytics
    await queueService.drain();

    // Verify analytics event recorded in DB
    const event = await prisma.analyticsEvent.findFirst({
      where: { link: { shortCode: activeCode } },
      orderBy: { timestamp: 'desc' },
    });

    expect(event).toBeDefined();
    expect(event?.referrer).toBe('https://www.instagram.com');
  });

  it('should redirect disabled link to disabled error page for browsers', async () => {
    const res = await request(app)
      .get(`/${disabledCode}`)
      .set('Accept', 'text/html');

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/errors/disabled');
  });

  it('should redirect expired link to expired error page for browsers', async () => {
    const res = await request(app)
      .get(`/${expiredCode}`)
      .set('Accept', 'text/html');

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/errors/expired');
  });

  it('should redirect non-existent short code to not-found error page', async () => {
    const res = await request(app)
      .get('/nonexistent_slug_999')
      .set('Accept', 'text/html');

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/errors/not-found');
  });
});
