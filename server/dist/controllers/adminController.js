"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const adminService_1 = require("../services/adminService");
const auditService_1 = require("../services/auditService");
exports.adminController = {
    async getOverview(req, res) {
        try {
            const stats = await adminService_1.adminService.getOverviewStats();
            res.status(200).json({ success: true, stats });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async getUsers(req, res) {
        try {
            const { page, limit, search, status } = req.query;
            const result = await adminService_1.adminService.getUsers(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, search, status);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async suspendUser(req, res) {
        try {
            const user = await adminService_1.adminService.suspendUser(req.user.id, req.params.id, req.body.reason);
            res.status(200).json({
                success: true,
                user,
                message: 'User account has been suspended.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async reactivateUser(req, res) {
        try {
            const user = await adminService_1.adminService.reactivateUser(req.user.id, req.params.id);
            res.status(200).json({
                success: true,
                user,
                message: 'User account has been reactivated.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async getLinks(req, res) {
        try {
            const { page, limit, search, status } = req.query;
            const result = await adminService_1.adminService.getLinks(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, search, status);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async blockLink(req, res) {
        try {
            const link = await adminService_1.adminService.blockLink(req.user.id, req.params.id, req.body.reason);
            res.status(200).json({
                success: true,
                link,
                message: 'Link has been blocked across the platform.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async unblockLink(req, res) {
        try {
            const link = await adminService_1.adminService.unblockLink(req.user.id, req.params.id);
            res.status(200).json({
                success: true,
                link,
                message: 'Link has been unblocked.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async getBlockedDomains(req, res) {
        try {
            const domains = await adminService_1.adminService.getBlockedDomains();
            res.status(200).json({ success: true, domains });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async addBlockedDomain(req, res) {
        try {
            const domain = await adminService_1.adminService.addBlockedDomain(req.user.id, req.body.domain, req.body.reason);
            res.status(201).json({
                success: true,
                domain,
                message: 'Domain added to blocklist.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async removeBlockedDomain(req, res) {
        try {
            const result = await adminService_1.adminService.removeBlockedDomain(req.user.id, req.params.id);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async getAuditLogs(req, res) {
        try {
            const { page, limit, action, targetType } = req.query;
            const result = await auditService_1.auditService.getAuditLogs(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20, action, targetType);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async getSystemHealth(req, res) {
        try {
            const health = await adminService_1.adminService.getSystemHealth();
            res.status(200).json({ success: true, health });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
};
