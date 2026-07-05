import { Router } from 'express';
import { listShops, createShop, updateShop, deleteShop } from '../controllers/shop.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listShops);
router.post('/', requireAuth, requireRole('admin'), createShop);
router.put('/:id', requireAuth, requireRole('admin'), updateShop);
router.delete('/:id', requireAuth, requireRole('admin'), deleteShop);

export default router;
