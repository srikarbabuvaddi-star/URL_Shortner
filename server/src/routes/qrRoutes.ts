import { Router } from 'express';
import { qrController } from '../controllers/qrController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', qrController.getUserQrCodes);

export default router;
