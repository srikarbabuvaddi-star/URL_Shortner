import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/src/app';

const app = createApp();

describe('Admin Management & Platform Security Suite', () => {
  let adminToken: string;
  let testLinkId: string;

  beforeAll(async () => {
    // Log in as seeded Admin
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@linkpulse.io',
      password: process.env.ADMIN_PASSWORD || 'AdminPassword2026!',
    });
    adminToken = res.body.token;
  });

  it('should retrieve platform-wide overview statistics', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.users.total).toBeGreaterThan(0);
    expect(res.body.stats.links.total).toBeGreaterThan(0);
    expect(res.body.stats.traffic.totalEvents).toBeGreaterThan(0);
  });

  it('should list all platform users with pagination and search', async () => {
    const res = await request(app)
      .get('/api/admin/users?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
  });

  it('should list all platform links and allow blocking an abusive link', async () => {
    const linksRes = await request(app)
      .get('/api/admin/links?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(linksRes.status).toBe(200);
    expect(linksRes.body.links.length).toBeGreaterThan(0);
    testLinkId = linksRes.body.links[0].id;

    // Block the link
    const blockRes = await request(app)
      .post(`/api/admin/links/${testLinkId}/block`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Abuse investigation test' });

    expect(blockRes.status).toBe(200);
    expect(blockRes.body.link.status).toBe('BLOCKED');

    // Unblock the link back to active
    const unblockRes = await request(app)
      .post(`/api/admin/links/${testLinkId}/unblock`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(unblockRes.status).toBe(200);
    expect(unblockRes.body.link.status).toBe('ACTIVE');
  });

  it('should manage blocked domains list', async () => {
    const domainToAdd = `bad-phish-${Date.now()}.com`;

    // Add blocked domain
    const addRes = await request(app)
      .post('/api/admin/blocked-domains')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ domain: domainToAdd, reason: 'Malware host test' });

    expect(addRes.status).toBe(201);
    expect(addRes.body.domain.domain).toBe(domainToAdd);
    const domainId = addRes.body.domain.id;

    // Remove blocked domain
    const delRes = await request(app)
      .delete(`/api/admin/blocked-domains/${domainId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(delRes.status).toBe(200);
  });

  it('should inspect system health metrics', async () => {
    const res = await request(app)
      .get('/api/admin/system')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.health.database.status).toBe('healthy');
    expect(res.body.health.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
