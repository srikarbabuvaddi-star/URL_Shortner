"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const linkRoutes_1 = __importDefault(require("./linkRoutes"));
const campaignRoutes_1 = __importDefault(require("./campaignRoutes"));
const analyticsRoutes_1 = __importDefault(require("./analyticsRoutes"));
const qrRoutes_1 = __importDefault(require("./qrRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        service: 'LinkPulse API',
    });
});
router.use('/auth', authRoutes_1.default);
router.use('/links', linkRoutes_1.default);
router.use('/campaigns', campaignRoutes_1.default);
router.use('/analytics', analyticsRoutes_1.default);
router.use('/qr', qrRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
exports.default = router;
