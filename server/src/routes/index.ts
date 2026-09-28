import { Router } from 'express';
import authRoutes from './authRoutes';
import linkRoutes from './linkRoutes';
import campaignRoutes from './campaignRoutes';
import analyticsRoutes from './analyticsRoutes';
import qrRoutes from './qrRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    service: 'LinkPulse API',
  });
});

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/qr', qrRoutes);
router.use('/admin', adminRoutes);

export default router;
