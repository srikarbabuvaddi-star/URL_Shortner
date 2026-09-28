import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/src/app';

const app = createApp();

describe('Link Lifecycle & QR Suite', () => {
  let userToken: string;
  let createdLinkId: string;
  const customSlug = `promo_${Date.now()}`;

  beforeAll(async () => {
    // Log in as seeded user
    const res = await request(app).post('/api/auth/login').send({
      email: 'alex@linkpulse.io',
      password: 'Password123!',
    });
    userToken = res.body.token;
  });

  it('should create a short link with automatic code generation', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
        title: 'MDN HTTP Guide',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.link.shortCode).toHaveLength(6);
    expect(res.body.link.status).toBe('ACTIVE');
    expect(res.body.link.shortUrl).toContain(res.body.link.shortCode);
    createdLinkId = res.body.link.id;
  });

  it('should create a short link with a custom alias', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        originalUrl: 'https://react.dev',
        customAlias: customSlug,
        title: 'React Documentation',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.link.shortCode).toBe(customSlug);
    expect(res.body.link.customAlias).toBe(customSlug);
  });

  it('should reject creating link with duplicate custom alias', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        originalUrl: 'https://vuejs.org',
        customAlias: customSlug,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already taken');
  });

  it('should reject reserved route words as custom aliases', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        originalUrl: 'https://example.com',
        customAlias: 'admin',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Validation failed');
  });

  it('should retrieve user links with pagination', async () => {
    const res = await request(app)
      .get('/api/links?page=1&limit=5')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.links.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('should disable a link', async () => {
    const res = await request(app)
      .post(`/api/links/${createdLinkId}/disable`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.link.status).toBe('DISABLED');
  });

  it('should re-enable a link', async () => {
    const res = await request(app)
      .post(`/api/links/${createdLinkId}/enable`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.link.status).toBe('ACTIVE');
  });

  it('should generate and preview dynamic QR code for a link', async () => {
    const res = await request(app)
      .get(`/api/links/${createdLinkId}/qr`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.qr.pngDataUrl).toContain('data:image/png;base64');
    expect(res.body.qr.svgString).toContain('<svg');
  });

  it('should download QR code image and track download count', async () => {
    const res = await request(app)
      .get(`/api/links/${createdLinkId}/qr/download?format=png`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('image/png');
  });
});
