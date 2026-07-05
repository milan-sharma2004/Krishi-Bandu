import { Router } from 'express';
import {
  createOrder,
  myOrders,
  sellerOrders,
  getOrder,
  updateOrderStatus,
  listAllOrders,
} from '../controllers/order.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('buyer'), createOrder);
router.get('/mine', requireAuth, requireRole('buyer'), myOrders);
router.get('/selling', requireAuth, requireRole('farmer'), sellerOrders);
router.get('/all', requireAuth, requireRole('admin'), listAllOrders);
router.get('/:id', requireAuth, getOrder);
router.patch('/:id/status', requireAuth, requireRole('farmer'), updateOrderStatus);

export default router;
