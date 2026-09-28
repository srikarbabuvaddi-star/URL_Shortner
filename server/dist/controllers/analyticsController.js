"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const analyticsService_1 = require("../services/analyticsService");
exports.analyticsController = {
    async getLinkAnalytics(req, res) {
        try {
            const data = await analyticsService_1.analyticsService.getLinkAnalytics(req.params.id, req.user.id, req.user.role, req.query);
            res.status(200).json({ success: true, data });
        }
        catch (err) {
            const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async getCampaignAnalytics(req, res) {
        try {
            const data = await analyticsService_1.analyticsService.getCampaignAnalytics(req.params.id, req.user.id, req.user.role, req.query);
            res.status(200).json({ success: true, data });
        }
        catch (err) {
            const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async getOverview(req, res) {
        try {
            const data = await analyticsService_1.analyticsService.getUserOverviewAnalytics(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async exportReport(req, res) {
        try {
            const linkId = req.query.linkId;
            const format = req.query.format || 'csv';
            if (!linkId) {
                res.status(400).json({ success: false, error: 'Query parameter linkId is required.' });
                return;
            }
            const result = await analyticsService_1.analyticsService.exportAnalytics(linkId, req.user.id, req.user.role, format);
            res.setHeader('Content-Type', result.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
            res.send(result.data);
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
};
