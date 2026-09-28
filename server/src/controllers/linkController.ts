import { Request, Response } from 'express';
import { linkService } from '../services/linkService';

export const linkController = {
  async createLink(req: Request, res: Response) {
    try {
      const link = await linkService.createLink(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        link,
        message: 'Short link successfully generated.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getLinks(req: Request, res: Response) {
    try {
      const result = await linkService.getUserLinks(req.user!.id, req.query as any);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getLinkById(req: Request, res: Response) {
    try {
      const link = await linkService.getLinkById(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, link });
    } catch (err: any) {
      const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async updateLink(req: Request, res: Response) {
    try {
      const link = await linkService.updateLink(req.params.id as string, req.user!.id, req.user!.role, req.body);
      res.status(200).json({
        success: true,
        link,
        message: 'Link updated successfully.',
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async deleteLink(req: Request, res: Response) {
    try {
      const result = await linkService.deleteLink(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json(result);
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async disableLink(req: Request, res: Response) {
    try {
      const link = await linkService.disableLink(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        link,
        message: 'Link has been disabled.',
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },

  async enableLink(req: Request, res: Response) {
    try {
      const link = await linkService.enableLink(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        link,
        message: 'Link has been enabled.',
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  },
};
