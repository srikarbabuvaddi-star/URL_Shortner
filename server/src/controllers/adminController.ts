import { Request, Response } from 'express';
import { adminService } from '../services/adminService';
import { auditService } from '../services/auditService';

export const adminController = {
  async getOverview(req: Request, res: Response) {
    try {
      const stats = await adminService.getOverviewStats();
      res.status(200).json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const { page, limit, search, status } = req.query as any;
      const result = await adminService.getUsers(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 10,
        search,
        status
      );
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async suspendUser(req: Request, res: Response) {
    try {
      const user = await adminService.suspendUser(req.user!.id, req.params.id as string, req.body.reason);
      res.status(200).json({
        success: true,
        user,
        message: 'User account has been suspended.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async reactivateUser(req: Request, res: Response) {
    try {
      const user = await adminService.reactivateUser(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        user,
        message: 'User account has been reactivated.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getLinks(req: Request, res: Response) {
    try {
      const { page, limit, search, status } = req.query as any;
      const result = await adminService.getLinks(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 10,
        search,
        status
      );
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async blockLink(req: Request, res: Response) {
    try {
      const link = await adminService.blockLink(req.user!.id, req.params.id as string, req.body.reason);
      res.status(200).json({
        success: true,
        link,
        message: 'Link has been blocked across the platform.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async unblockLink(req: Request, res: Response) {
    try {
      const link = await adminService.unblockLink(req.user!.id, req.params.id as string);
      res.status(200).json({
        success: true,
        link,
        message: 'Link has been unblocked.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getBlockedDomains(req: Request, res: Response) {
    try {
      const domains = await adminService.getBlockedDomains();
      res.status(200).json({ success: true, domains });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async addBlockedDomain(req: Request, res: Response) {
    try {
      const domain = await adminService.addBlockedDomain(req.user!.id, req.body.domain, req.body.reason);
      res.status(201).json({
        success: true,
        domain,
        message: 'Domain added to blocklist.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async removeBlockedDomain(req: Request, res: Response) {
    try {
      const result = await adminService.removeBlockedDomain(req.user!.id, req.params.id as string);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getAuditLogs(req: Request, res: Response) {
    try {
      const { page, limit, action, targetType } = req.query as any;
      const result = await auditService.getAuditLogs(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20,
        action,
        targetType
      );
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getSystemHealth(req: Request, res: Response) {
    try {
      const health = await adminService.getSystemHealth();
      res.status(200).json({ success: true, health });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
