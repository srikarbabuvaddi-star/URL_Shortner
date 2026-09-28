import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export const analyticsController = {
  async getLinkAnalytics(req: Request, res: Response) {
    try {
      const data = await analyticsService.getLinkAnalytics(
        req.params.id as string,
        req.user!.id,
        req.user!.role,
        req.query as any
      );
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async getCampaignAnalytics(req: Request, res: Response) {
    try {
      const data = await analyticsService.getCampaignAnalytics(
        req.params.id as string,
        req.user!.id,
        req.user!.role,
        req.query as any
      );
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async getOverview(req: Request, res: Response) {
    try {
      const data = await analyticsService.getUserOverviewAnalytics(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async exportReport(req: Request, res: Response) {
    try {
      const linkId = req.query.linkId as string;
      const format = (req.query.format as string) || 'csv';

      if (!linkId) {
        res.status(400).json({ success: false, error: 'Query parameter linkId is required.' });
        return;
      }

      const result = await analyticsService.exportAnalytics(linkId, req.user!.id, req.user!.role, format);

      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.data);
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },
};
