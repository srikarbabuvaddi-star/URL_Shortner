import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/rbacMiddleware';
import { validateBody, validateQuery } from '../middleware/validateMiddleware';
import {
  suspendUserSchema,
  blockLinkSchema,
  addBlockedDomainSchema,
  adminUserQuerySchema,
  adminLinkQuerySchema,
} from '../validators/adminValidators';

const router = Router();

// Strict RBAC Middleware applied to all admin routes
router.use(requireAuth);
router.use(requireAdmin);

router.get('/overview', adminController.getOverview);
router.get('/users', validateQuery(adminUserQuerySchema), adminController.getUsers);
router.post('/users/:id/suspend', validateBody(suspendUserSchema), adminController.suspendUser);
router.post('/users/:id/reactivate', adminController.reactivateUser);

router.get('/links', validateQuery(adminLinkQuerySchema), adminController.getLinks);
router.post('/links/:id/block', validateBody(blockLinkSchema), adminController.blockLink);
router.post('/links/:id/unblock', adminController.unblockLink);

router.get('/blocked-domains', adminController.getBlockedDomains);
router.post('/blocked-domains', validateBody(addBlockedDomainSchema), adminController.addBlockedDomain);
router.delete('/blocked-domains/:id', adminController.removeBlockedDomain);

router.get('/audit-logs', adminController.getAuditLogs);
router.get('/system', adminController.getSystemHealth);

export default router;
