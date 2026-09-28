"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkController = void 0;
const linkService_1 = require("../services/linkService");
exports.linkController = {
    async createLink(req, res) {
        try {
            const link = await linkService_1.linkService.createLink(req.user.id, req.body);
            res.status(201).json({
                success: true,
                link,
                message: 'Short link successfully generated.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async getLinks(req, res) {
        try {
            const result = await linkService_1.linkService.getUserLinks(req.user.id, req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async getLinkById(req, res) {
        try {
            const link = await linkService_1.linkService.getLinkById(req.params.id, req.user.id, req.user.role);
            res.status(200).json({ success: true, link });
        }
        catch (err) {
            const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async updateLink(req, res) {
        try {
            const link = await linkService_1.linkService.updateLink(req.params.id, req.user.id, req.user.role, req.body);
            res.status(200).json({
                success: true,
                link,
                message: 'Link updated successfully.',
            });
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async deleteLink(req, res) {
        try {
            const result = await linkService_1.linkService.deleteLink(req.params.id, req.user.id, req.user.role);
            res.status(200).json(result);
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async disableLink(req, res) {
        try {
            const link = await linkService_1.linkService.disableLink(req.params.id, req.user.id, req.user.role);
            res.status(200).json({
                success: true,
                link,
                message: 'Link has been disabled.',
            });
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async enableLink(req, res) {
        try {
            const link = await linkService_1.linkService.enableLink(req.params.id, req.user.id, req.user.role);
            res.status(200).json({
                success: true,
                link,
                message: 'Link has been enabled.',
            });
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
};
