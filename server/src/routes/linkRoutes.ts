import { Router } from 'express';
import { linkController } from '../controllers/linkController';
import { qrController } from '../controllers/qrController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validateMiddleware';
import { createLinkSchema, updateLinkSchema, linkQuerySchema } from '../validators/linkValidators';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createLinkSchema), linkController.createLink);
router.get('/', validateQuery(linkQuerySchema), linkController.getLinks);
router.get('/:id', linkController.getLinkById);
router.patch('/:id', validateBody(updateLinkSchema), linkController.updateLink);
router.delete('/:id', linkController.deleteLink);

router.post('/:id/disable', linkController.disableLink);
router.post('/:id/enable', linkController.enableLink);

// Nested QR endpoints on links
router.post('/:id/qr', qrController.generateQr);
router.get('/:id/qr', qrController.getQrPreview);
router.get('/:id/qr/download', qrController.downloadQr);

export default router;
