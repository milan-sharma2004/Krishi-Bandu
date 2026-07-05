import { Router } from 'express';
import {
  overview,
  listUsers,
  updateUserStatus,
  deleteUser,
  listAdminProducts,
  updateProductStatus,
  deleteProductAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/overview', overview);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/products', listAdminProducts);
router.patch('/products/:id/status', updateProductStatus);
router.delete('/products/:id', deleteProductAdmin);
router.patch('/orders/:id/status', updateOrderStatusAdmin);
router.delete('/orders/:id', deleteOrderAdmin);

export default router;
