import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidators';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);
router.patch('/profile', requireAuth, validateBody(updateProfileSchema), authController.updateProfile);

export default router;
