import { api } from './api';

export interface BreakdownItem {
  name: string;
  count: number;
}

export interface LinkAnalyticsData {
  link: {
    id: string;
    shortCode: string;
    customAlias?: string;
    originalUrl: string;
    title?: string;
    status: string;
    lastClickedAt?: string;
    createdAt: string;
    campaign?: { id: string; name: string } | null;
  };
  kpis: {
    totalClicks: number;
    allTimeClicks: number;
    uniqueVisitors: number;
    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    humanClicks: number;
    botClicks: number;
    lastClickedAt?: string;
  };
  timeline: Array<{ date: string; clicks: number; uniqueVisitors: number }>;
  breakdowns: {
    devices: BreakdownItem[];
    browsers: BreakdownItem[];
    operatingSystems: BreakdownItem[];
    countries: BreakdownItem[];
    referrers: BreakdownItem[];
  };
  recentEvents: Array<{
    id: string;
    timestamp: string;
    country: string;
    deviceType: string;
    browser: string;
    os: string;
    referrer: string;
    isBot: boolean;
  }>;
}

export interface CampaignAnalyticsData {
  campaign: {
    id: string;
    name: string;
    description?: string;
    status: string;
  };
  kpis: {
    totalClicks: number;
    uniqueVisitors: number;
    totalChannels: number;
    qrAttributedVisits: number;
  };
  channels: Array<{
    channel: string;
    shortCode: string;
    clicks: number;
    uniqueVisitors: number;
    isQr: boolean;
  }>;
  timeline: Array<{ date: string; clicks: number; uniqueVisitors: number }>;
}

export interface OverviewAnalyticsData {
  kpis: {
    totalLinks: number;
    activeLinks: number;
    disabledLinks: number;
    expiredLinks: number;
    totalClicks: number;
    clicksToday: number;
    uniqueVisitors30d: number;
    totalCampaigns: number;
    totalQrCodes: number;
  };
  timeline: Array<{ date: string; clicks: number }>;
}

export const analyticsService = {
  async getOverview() {
    return api.get<{ success: boolean; data: OverviewAnalyticsData }>('/analytics/overview');
  },

  async getLinkAnalytics(linkId: string, period = '30d') {
    return api.get<{ success: boolean; data: LinkAnalyticsData }>(`/analytics/link/${linkId}?period=${period}`);
  },

  async getCampaignAnalytics(campaignId: string, period = '30d') {
    return api.get<{ success: boolean; data: CampaignAnalyticsData }>(`/analytics/campaign/${campaignId}?period=${period}`);
  },

  async exportReport(linkId: string, format: 'csv' | 'json' = 'csv', filename = 'analytics') {
    const token = localStorage.getItem('lp_token');
    const response = await fetch(`/api/analytics/export?linkId=${linkId}&format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
