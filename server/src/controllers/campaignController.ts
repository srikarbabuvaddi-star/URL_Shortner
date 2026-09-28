import { Request, Response } from 'express';
import { campaignService } from '../services/campaignService';

export const campaignController = {
  async createCampaign(req: Request, res: Response) {
    try {
      const campaign = await campaignService.createCampaign(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        campaign,
        message: 'Campaign created successfully.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getCampaigns(req: Request, res: Response) {
    try {
      const result = await campaignService.getUserCampaigns(req.user!.id, req.query as any);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getCampaignById(req: Request, res: Response) {
    try {
      const campaign = await campaignService.getCampaignById(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, campaign });
    } catch (err: any) {
      const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async updateCampaign(req: Request, res: Response) {
    try {
      const campaign = await campaignService.updateCampaign(req.params.id as string, req.user!.id, req.user!.role, req.body);
      res.status(200).json({
        success: true,
        campaign,
        message: 'Campaign updated successfully.',
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async deleteCampaign(req: Request, res: Response) {
    try {
      const result = await campaignService.deleteCampaign(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json(result);
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },
};
