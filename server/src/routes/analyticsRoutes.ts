import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/overview', analyticsController.getOverview);
router.get('/link/:id', analyticsController.getLinkAnalytics);
router.get('/campaign/:id', analyticsController.getCampaignAnalytics);
router.get('/export', analyticsController.exportReport);

export default router;
