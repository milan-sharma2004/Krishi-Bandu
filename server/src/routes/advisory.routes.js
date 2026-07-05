import { Router } from 'express';
import { listAdvisories, createAdvisory, deleteAdvisory } from '../controllers/advisory.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listAdvisories);
router.post('/', requireAuth, requireRole('admin'), createAdvisory);
router.delete('/:id', requireAuth, requireRole('admin'), deleteAdvisory);

export default router;
