import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LinkPulse database seeding...');

  // 1. Clean existing records (in dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.qrCode.deleteMany();
  await prisma.campaignLink.deleteMany();
  await prisma.link.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.blockedDomain.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, salt);
  const userPasswordHash = await bcrypt.hash('Password123!', salt);

  // 3. Create Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@linkpulse.io').toLowerCase().trim();
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`👤 Created Admin user: ${admin.email}`);

  // 4. Create Standard User
  const user = await prisma.user.create({
    data: {
      name: 'Alex Walker',
      email: 'alex@linkpulse.io',
      passwordHash: userPasswordHash,
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  console.log(`👤 Created Standard user: ${user.email} (Password: Password123!)`);

  // 5. Create Sample Campaign: "Tech Fest 2026"
  const techFestCampaign = await prisma.campaign.create({
    data: {
      userId: user.id,
      name: 'Tech Fest 2026',
      description: 'Annual National Tech Fest — Multi-channel attribution for social & campus QR banners',
      status: 'ACTIVE',
    },
  });
  console.log(`🎯 Created Campaign: "${techFestCampaign.name}"`);

  // 6. Create Campaign Links
  const destinationUrl = 'https://example.com/events/tech-fest-2026';

  const campaignChannels = [
    {
      shortCode: 'insta01',
      title: 'Tech Fest — Instagram Promo',
      channel: 'Instagram',
      source: 'instagram',
      medium: 'social',
      hasQr: false,
    },
    {
      shortCode: 'wa01',
      title: 'Tech Fest — WhatsApp Groups',
      channel: 'WhatsApp',
      source: 'whatsapp',
      medium: 'direct_msg',
      hasQr: false,
    },
    {
      shortCode: 'yt01',
      title: 'Tech Fest — YouTube Teaser',
      channel: 'YouTube',
      source: 'youtube',
      medium: 'video',
      hasQr: false,
    },
    {
      shortCode: 'qr01',
      title: 'Tech Fest — Campus Poster QR',
      channel: 'Poster QR',
      source: 'qr_poster',
      medium: 'offline_print',
      hasQr: true,
    },
    {
      shortCode: 'qr02',
      title: 'Tech Fest — Main Auditorium Banner QR',
      channel: 'College Banner QR',
      source: 'qr_banner',
      medium: 'offline_banner',
      hasQr: true,
    },
  ];

  const createdLinks: any[] = [];

  for (const c of campaignChannels) {
    const link = await prisma.link.create({
      data: {
        userId: user.id,
        campaignId: techFestCampaign.id,
        shortCode: c.shortCode,
        customAlias: c.shortCode,
        originalUrl: destinationUrl,
        title: c.title,
        status: 'ACTIVE',
      },
    });

    await prisma.campaignLink.create({
      data: {
        campaignId: techFestCampaign.id,
        linkId: link.id,
        channel: c.channel,
        source: c.source,
        medium: c.medium,
      },
    });

    if (c.hasQr) {
      await prisma.qrCode.create({
        data: {
          linkId: link.id,
          format: 'PNG',
          downloadCount: 14,
        },
      });
    }

    createdLinks.push({ ...link, isQr: c.hasQr, channel: c.channel });
  }

  // 7. Create Additional Standalone Links demonstrating lifecycles
  const now = new Date();
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const futureDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days ahead

  const standaloneLinks = [
    {
      userId: user.id,
      shortCode: 'launch26',
      customAlias: 'launch26',
      originalUrl: 'https://github.com/features/actions',
      title: 'Product Launch Hub',
      status: 'ACTIVE',
      expiresAt: futureDate,
      hasQr: true,
    },
    {
      userId: user.id,
      shortCode: 'oldfest25',
      customAlias: 'oldfest25',
      originalUrl: 'https://example.com/archive/2025',
      title: 'Archived 2025 Event (Expired)',
      status: 'EXPIRED',
      expiresAt: pastDate,
      hasQr: false,
    },
    {
      userId: user.id,
      shortCode: 'pauseme',
      customAlias: 'pauseme',
      originalUrl: 'https://example.com/paused-promo',
      title: 'Temporarily Disabled Promo',
      status: 'DISABLED',
      hasQr: false,
    },
  ];

  for (const sl of standaloneLinks) {
    const link = await prisma.link.create({
      data: {
        userId: sl.userId,
        shortCode: sl.shortCode,
        customAlias: sl.customAlias,
        originalUrl: sl.originalUrl,
        title: sl.title,
        status: sl.status,
        expiresAt: sl.expiresAt || null,
      },
    });

    if (sl.hasQr) {
      await prisma.qrCode.create({
        data: {
          linkId: link.id,
          format: 'PNG',
          downloadCount: 3,
        },
      });
    }

    createdLinks.push({ ...link, isQr: sl.hasQr, channel: 'Direct' });
  }

  console.log(`🔗 Created ${createdLinks.length} sample links.`);

  // 8. Seed Realistic Analytics Events
  console.log('📊 Seeding analytics events...');

  const countries = ['United States', 'India', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'Japan'];
  const regions = ['California', 'Karnataka', 'England', 'Bavaria', 'Ontario', 'New South Wales', 'Tokyo'];
  const browsers = [
    { name: 'Chrome', ver: '124.0' },
    { name: 'Safari', ver: '17.4' },
    { name: 'Firefox', ver: '125.0' },
    { name: 'Edge', ver: '123.0' },
  ];
  const operatingSystems = [
    { os: 'iOS', ver: '17.4', dev: 'Mobile' },
    { os: 'Android', ver: '14.0', dev: 'Mobile' },
    { os: 'Windows', ver: '11', dev: 'Desktop' },
    { os: 'macOS', ver: '14.4', dev: 'Desktop' },
    { os: 'iPadOS', ver: '17.4', dev: 'Tablet' },
  ];
  const referrers = [
    'https://www.instagram.com',
    'https://web.whatsapp.com',
    'https://www.youtube.com',
    'https://www.google.com',
    'https://t.co',
    '', // Direct
  ];

  // Create ~20 visitor IDs to demonstrate unique visitors vs total clicks
  const visitorPool = Array.from({ length: 25 }, (_, i) => `visitor_${i + 1}_hash`);

  const eventsData: any[] = [];

  // Generate realistic events over the past 14 days
  for (let i = 0; i < 220; i++) {
    // Pick link with weighted distribution (QR poster & Instagram get more clicks)
    const linkIndex = i % createdLinks.length;
    const targetLink = createdLinks[linkIndex];

    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const eventTime = new Date(now.getTime() - (daysAgo * 24 * 60 + hoursAgo * 60 + minutesAgo) * 60 * 1000);

    const isBot = Math.random() < 0.08; // 8% bot traffic
    const visitorId = isBot ? `bot_${Math.floor(Math.random() * 5)}` : visitorPool[i % visitorPool.length];
    const ipHash = `hash_${Math.floor(Math.random() * 50)}`;

    const countryIdx = Math.floor(Math.random() * countries.length);
    const osItem = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    const browserItem = browsers[Math.floor(Math.random() * browsers.length)];

    let referrer = referrers[Math.floor(Math.random() * referrers.length)];
    if (targetLink.channel === 'Instagram') referrer = 'https://www.instagram.com';
    if (targetLink.channel === 'WhatsApp') referrer = 'https://web.whatsapp.com';
    if (targetLink.channel === 'YouTube') referrer = 'https://www.youtube.com';
    if (targetLink.isQr) referrer = ''; // QR scans are direct / no referrer

    eventsData.push({
      linkId: targetLink.id,
      campaignId: targetLink.campaignId || null,
      timestamp: eventTime,
      visitorId,
      ipHash,
      country: countries[countryIdx],
      region: regions[countryIdx],
      city: 'Metro Area',
      deviceType: isBot ? 'Bot' : targetLink.isQr ? 'Mobile' : osItem.dev,
      browser: isBot ? 'Googlebot' : browserItem.name,
      browserVersion: browserItem.ver,
      os: isBot ? 'Bot' : targetLink.isQr ? (Math.random() > 0.4 ? 'iOS' : 'Android') : osItem.os,
      osVersion: osItem.ver,
      referrer: referrer || null,
      userAgent: isBot
        ? 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
      isBot,
      statusCode: 302,
    });
  }

  await prisma.analyticsEvent.createMany({
    data: eventsData,
  });

  // Update lastClickedAt on links
  for (const l of createdLinks) {
    await prisma.link.update({
      where: { id: l.id },
      data: { lastClickedAt: new Date() },
    });
  }

  console.log(`📈 Seeded ${eventsData.length} analytics events.`);

  // 9. Seed Blocked Domains
  await prisma.blockedDomain.createMany({
    data: [
      { domain: 'malicious-phishing.com', reason: 'Verified credential phishing' },
      { domain: 'spam-tracker.xyz', reason: 'High-frequency malware distribution' },
      { domain: 'fake-bank-login.net', reason: 'Financial fraud impersonation' },
    ],
  });
  console.log('🛡️ Seeded blocked domain rules.');

  // 10. Seed Admin Audit Log
  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      action: 'SYSTEM_INITIALIZE',
      targetType: 'SYSTEM',
      targetId: 'linkpulse-core',
      metadata: JSON.stringify({ message: 'Platform initialized with seed data' }),
    },
  });

  console.log('✅ LinkPulse database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
