"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const prisma_1 = require("../config/prisma");
exports.analyticsService = {
    /**
     * Resolves date filter boundary timestamps
     */
    resolveDateRange(options) {
        const to = options?.endDate ? new Date(options.endDate) : new Date();
        let from;
        const period = options?.period || '30d';
        if (period === 'today') {
            from = new Date();
            from.setHours(0, 0, 0, 0);
        }
        else if (period === '7d') {
            from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        else if (period === '90d') {
            from = new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);
        }
        else if (period === 'custom' && options?.startDate) {
            from = new Date(options.startDate);
        }
        else {
            // Default: 30 days
            from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        return { from, to };
    },
    /**
     * Generates comprehensive analytics report for a specific link
     */
    async getLinkAnalytics(linkId, userId, userRole, filter) {
        const link = await prisma_1.prisma.link.findUnique({
            where: { id: linkId },
            include: {
                campaign: true,
                campaignLinks: true,
                qrCodes: true,
            },
        });
        if (!link) {
            throw new Error('Link not found.');
        }
        if (link.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to view analytics for this link.');
            err.statusCode = 403;
            throw err;
        }
        const { from, to } = this.resolveDateRange(filter);
        // Query events in date range
        const events = await prisma_1.prisma.analyticsEvent.findMany({
            where: {
                linkId,
                timestamp: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { timestamp: 'asc' },
        });
        // Time boundary counts for KPI summary
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [clicksToday, clicksThisWeek, clicksThisMonth, allTimeTotal] = await Promise.all([
            prisma_1.prisma.analyticsEvent.count({
                where: { linkId, timestamp: { gte: startOfToday } },
            }),
            prisma_1.prisma.analyticsEvent.count({
                where: { linkId, timestamp: { gte: startOfWeek } },
            }),
            prisma_1.prisma.analyticsEvent.count({
                where: { linkId, timestamp: { gte: startOfMonth } },
            }),
            prisma_1.prisma.analyticsEvent.count({
                where: { linkId },
            }),
        ]);
        // Unique visitors calculation (distinct visitorId count)
        const uniqueVisitorIds = new Set();
        let botCount = 0;
        let humanCount = 0;
        const deviceCounts = {};
        const browserCounts = {};
        const osCounts = {};
        const countryCounts = {};
        const referrerCounts = {};
        // Grouping by date for chart (YYYY-MM-DD)
        const timelineMap = {};
        for (const ev of events) {
            if (ev.isBot) {
                botCount++;
            }
            else {
                humanCount++;
            }
            uniqueVisitorIds.add(ev.visitorId);
            // Device breakdown
            const device = ev.deviceType || 'Unknown';
            deviceCounts[device] = (deviceCounts[device] || 0) + 1;
            // Browser breakdown
            const browser = ev.browser || 'Unknown';
            browserCounts[browser] = (browserCounts[browser] || 0) + 1;
            // OS breakdown
            const os = ev.os || 'Unknown';
            osCounts[os] = (osCounts[os] || 0) + 1;
            // Country breakdown
            const country = ev.country || 'Unknown';
            countryCounts[country] = (countryCounts[country] || 0) + 1;
            // Referrer breakdown
            const ref = ev.referrer ? this.cleanReferrer(ev.referrer) : 'Direct / None';
            referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
            // Timeline grouping
            const dateKey = ev.timestamp.toISOString().split('T')[0];
            if (!timelineMap[dateKey]) {
                timelineMap[dateKey] = { date: dateKey, clicks: 0, uniqueVisitors: new Set() };
            }
            timelineMap[dateKey].clicks++;
            timelineMap[dateKey].uniqueVisitors.add(ev.visitorId);
        }
        const timeline = Object.values(timelineMap).map((item) => ({
            date: item.date,
            clicks: item.clicks,
            uniqueVisitors: item.uniqueVisitors.size,
        }));
        return {
            link: {
                id: link.id,
                shortCode: link.shortCode,
                customAlias: link.customAlias,
                originalUrl: link.originalUrl,
                title: link.title,
                status: link.status,
                lastClickedAt: link.lastClickedAt,
                createdAt: link.createdAt,
                campaign: link.campaign ? { id: link.campaign.id, name: link.campaign.name } : null,
            },
            kpis: {
                totalClicks: events.length,
                allTimeClicks: allTimeTotal,
                uniqueVisitors: uniqueVisitorIds.size,
                clicksToday,
                clicksThisWeek,
                clicksThisMonth,
                humanClicks: humanCount,
                botClicks: botCount,
                lastClickedAt: link.lastClickedAt,
            },
            timeline,
            breakdowns: {
                devices: this.toSortedArray(deviceCounts),
                browsers: this.toSortedArray(browserCounts),
                operatingSystems: this.toSortedArray(osCounts),
                countries: this.toSortedArray(countryCounts),
                referrers: this.toSortedArray(referrerCounts),
            },
            recentEvents: events.slice(-20).reverse().map((ev) => ({
                id: ev.id,
                timestamp: ev.timestamp,
                country: ev.country || 'Unknown',
                deviceType: ev.deviceType || 'Unknown',
                browser: ev.browser || 'Unknown',
                os: ev.os || 'Unknown',
                referrer: ev.referrer || 'Direct',
                isBot: ev.isBot,
            })),
            dateRange: { from, to },
        };
    },
    /**
     * Generates campaign-level analytics with channel attribution comparison
     */
    async getCampaignAnalytics(campaignId, userId, userRole, filter) {
        const campaign = await prisma_1.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                links: {
                    include: {
                        campaignLinks: true,
                        qrCodes: true,
                    },
                },
            },
        });
        if (!campaign) {
            throw new Error('Campaign not found.');
        }
        if (campaign.userId !== userId && userRole !== 'ADMIN') {
            const err = new Error('Forbidden: You do not have permission to access this campaign.');
            err.statusCode = 403;
            throw err;
        }
        const { from, to } = this.resolveDateRange(filter);
        const linkIds = campaign.links.map((l) => l.id);
        const events = await prisma_1.prisma.analyticsEvent.findMany({
            where: {
                linkId: { in: linkIds },
                timestamp: { gte: from, lte: to },
            },
            orderBy: { timestamp: 'asc' },
        });
        // Channel attribution comparison
        const channelAttribution = {};
        for (const link of campaign.links) {
            const meta = link.campaignLinks[0];
            const channelName = meta?.channel || link.title || link.shortCode;
            const isQr = link.qrCodes.length > 0 || channelName.toLowerCase().includes('qr');
            channelAttribution[link.id] = {
                channel: channelName,
                shortCode: link.shortCode,
                clicks: 0,
                uniqueVisitors: new Set(),
                isQr,
            };
        }
        const overallUniqueVisitors = new Set();
        const timelineMap = {};
        let totalQrAttributedVisits = 0;
        for (const ev of events) {
            overallUniqueVisitors.add(ev.visitorId);
            const target = channelAttribution[ev.linkId];
            if (target) {
                target.clicks++;
                target.uniqueVisitors.add(ev.visitorId);
                if (target.isQr) {
                    totalQrAttributedVisits++;
                }
            }
            const dateKey = ev.timestamp.toISOString().split('T')[0];
            if (!timelineMap[dateKey]) {
                timelineMap[dateKey] = { date: dateKey, clicks: 0, uniqueVisitors: new Set() };
            }
            timelineMap[dateKey].clicks++;
            timelineMap[dateKey].uniqueVisitors.add(ev.visitorId);
        }
        const channels = Object.values(channelAttribution).map((item) => ({
            channel: item.channel,
            shortCode: item.shortCode,
            clicks: item.clicks,
            uniqueVisitors: item.uniqueVisitors.size,
            isQr: item.isQr,
        }));
        return {
            campaign: {
                id: campaign.id,
                name: campaign.name,
                description: campaign.description,
                status: campaign.status,
            },
            kpis: {
                totalClicks: events.length,
                uniqueVisitors: overallUniqueVisitors.size,
                totalChannels: campaign.links.length,
                qrAttributedVisits: totalQrAttributedVisits,
            },
            channels,
            timeline: Object.values(timelineMap).map((t) => ({
                date: t.date,
                clicks: t.clicks,
                uniqueVisitors: t.uniqueVisitors.size,
            })),
            dateRange: { from, to },
        };
    },
    /**
     * User dashboard overview summary across all user's links
     */
    async getUserOverviewAnalytics(userId) {
        const userLinks = await prisma_1.prisma.link.findMany({
            where: { userId },
            select: { id: true, shortCode: true, title: true, status: true, lastClickedAt: true, expiresAt: true },
        });
        const linkIds = userLinks.map((l) => l.id);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [totalClicks, clicksToday, events30Days, campaignsCount, qrCount] = await Promise.all([
            prisma_1.prisma.analyticsEvent.count({ where: { linkId: { in: linkIds } } }),
            prisma_1.prisma.analyticsEvent.count({
                where: { linkId: { in: linkIds }, timestamp: { gte: startOfToday } },
            }),
            prisma_1.prisma.analyticsEvent.findMany({
                where: { linkId: { in: linkIds }, timestamp: { gte: thirtyDaysAgo } },
                select: { visitorId: true, timestamp: true },
            }),
            prisma_1.prisma.campaign.count({ where: { userId } }),
            prisma_1.prisma.qrCode.count({ where: { link: { userId } } }),
        ]);
        const uniqueVisitors = new Set(events30Days.map((e) => e.visitorId)).size;
        // Timeline for last 14 days
        const dailyMap = {};
        for (let i = 13; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            dailyMap[d.toISOString().split('T')[0]] = 0;
        }
        for (const ev of events30Days) {
            const dateKey = ev.timestamp.toISOString().split('T')[0];
            if (dailyMap[dateKey] !== undefined) {
                dailyMap[dateKey]++;
            }
        }
        const timeline = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }));
        // Status breakdown
        let activeLinks = 0;
        let expiredLinks = 0;
        let disabledLinks = 0;
        for (const l of userLinks) {
            if (l.status === 'DISABLED')
                disabledLinks++;
            else if (l.status === 'EXPIRED' || (l.expiresAt && new Date(l.expiresAt) <= now))
                expiredLinks++;
            else
                activeLinks++;
        }
        return {
            kpis: {
                totalLinks: userLinks.length,
                activeLinks,
                disabledLinks,
                expiredLinks,
                totalClicks,
                clicksToday,
                uniqueVisitors30d: uniqueVisitors,
                totalCampaigns: campaignsCount,
                totalQrCodes: qrCount,
            },
            timeline,
        };
    },
    /**
     * Export raw analytics data in JSON or CSV
     */
    async exportAnalytics(linkId, userId, userRole, format = 'csv') {
        const report = await this.getLinkAnalytics(linkId, userId, userRole);
        if (format.toLowerCase() === 'json') {
            return {
                contentType: 'application/json',
                filename: `analytics-${report.link.shortCode}-${Date.now()}.json`,
                data: JSON.stringify(report, null, 2),
            };
        }
        // Generate CSV
        const headers = ['Timestamp', 'Country', 'Device', 'Browser', 'OS', 'Referrer', 'IsBot'];
        const rows = report.recentEvents.map((e) => [
            e.timestamp.toISOString(),
            `"${e.country}"`,
            `"${e.deviceType}"`,
            `"${e.browser}"`,
            `"${e.os}"`,
            `"${e.referrer}"`,
            e.isBot ? 'YES' : 'NO',
        ]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        return {
            contentType: 'text/csv',
            filename: `analytics-${report.link.shortCode}-${Date.now()}.csv`,
            data: csvContent,
        };
    },
    cleanReferrer(ref) {
        try {
            const url = new URL(ref);
            const host = url.hostname.replace(/^www\./, '');
            if (host.includes('instagram.com'))
                return 'Instagram';
            if (host.includes('whatsapp.com'))
                return 'WhatsApp';
            if (host.includes('youtube.com') || host.includes('youtu.be'))
                return 'YouTube';
            if (host.includes('twitter.com') || host.includes('x.com'))
                return 'Twitter / X';
            if (host.includes('facebook.com'))
                return 'Facebook';
            if (host.includes('linkedin.com'))
                return 'LinkedIn';
            if (host.includes('google.com'))
                return 'Google';
            return host;
        }
        catch {
            return ref.slice(0, 50);
        }
    },
    toSortedArray(dict) {
        return Object.entries(dict)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    },
};
