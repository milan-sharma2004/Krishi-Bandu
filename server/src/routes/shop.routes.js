import { Router } from 'express';
import { listShops, createShop, deleteShop } from '../controllers/shop.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listShops);
router.post('/', requireAuth, requireRole('admin'), createShop);
router.delete('/:id', requireAuth, requireRole('admin'), deleteShop);

export default router;
