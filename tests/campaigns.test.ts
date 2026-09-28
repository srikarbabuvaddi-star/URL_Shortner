import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/src/app';

const app = createApp();

describe('Campaigns & Channel Attribution Suite', () => {
  let userToken: string;
  let campaignId: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alex@linkpulse.io',
      password: 'Password123!',
    });
    userToken = res.body.token;
  });

  it('should list campaigns for current user', async () => {
    const res = await request(app)
      .get('/api/campaigns')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.campaigns.length).toBeGreaterThan(0);
    const targetCampaign = res.body.campaigns.find((c: any) => c.name === 'Tech Fest 2026') || res.body.campaigns[0];
    campaignId = targetCampaign.id;
  });

  it('should create a new campaign', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Spring Hackathon 2026',
        description: 'Multi-campus recruitment campaign',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.campaign.name).toBe('Spring Hackathon 2026');
  });

  it('should retrieve campaign details with associated links and channels', async () => {
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.campaign.name).toBe('Tech Fest 2026');
    expect(res.body.campaign.links.length).toBeGreaterThan(0);
  });

  it('should retrieve campaign analytics with channel-level comparison and QR attribution', async () => {
    const res = await request(app)
      .get(`/api/analytics/campaign/${campaignId}?period=30d`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.channels.length).toBeGreaterThan(0);
    expect(res.body.data.kpis.totalClicks).toBeGreaterThan(0);
    expect(res.body.data.kpis.uniqueVisitors).toBeGreaterThan(0);
  });
});
