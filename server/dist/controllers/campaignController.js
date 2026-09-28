"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignController = void 0;
const campaignService_1 = require("../services/campaignService");
exports.campaignController = {
    async createCampaign(req, res) {
        try {
            const campaign = await campaignService_1.campaignService.createCampaign(req.user.id, req.body);
            res.status(201).json({
                success: true,
                campaign,
                message: 'Campaign created successfully.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async getCampaigns(req, res) {
        try {
            const result = await campaignService_1.campaignService.getUserCampaigns(req.user.id, req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async getCampaignById(req, res) {
        try {
            const campaign = await campaignService_1.campaignService.getCampaignById(req.params.id, req.user.id, req.user.role);
            res.status(200).json({ success: true, campaign });
        }
        catch (err) {
            const status = err.statusCode || (err.message.includes('Forbidden') ? 403 : 404);
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async updateCampaign(req, res) {
        try {
            const campaign = await campaignService_1.campaignService.updateCampaign(req.params.id, req.user.id, req.user.role, req.body);
            res.status(200).json({
                success: true,
                campaign,
                message: 'Campaign updated successfully.',
            });
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
    async deleteCampaign(req, res) {
        try {
            const result = await campaignService_1.campaignService.deleteCampaign(req.params.id, req.user.id, req.user.role);
            res.status(200).json(result);
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    },
};
