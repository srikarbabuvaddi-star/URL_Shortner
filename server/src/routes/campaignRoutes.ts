import { Router } from 'express';
import { campaignController } from '../controllers/campaignController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validateMiddleware';
import { createCampaignSchema, updateCampaignSchema, campaignQuerySchema } from '../validators/campaignValidators';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createCampaignSchema), campaignController.createCampaign);
router.get('/', validateQuery(campaignQuerySchema), campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.patch('/:id', validateBody(updateCampaignSchema), campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

export default router;
