import { Router } from 'express';
import { handleRedirect } from '../redirect/redirectEngine';

const router = Router();

// Primary short code redirection route
router.get('/:shortCode', handleRedirect);

export default router;
