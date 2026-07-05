import { Router } from 'express';
import {
  listProducts,
  myProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/mine', requireAuth, requireRole('farmer'), myProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, requireRole('farmer'), createProduct);
router.put('/:id', requireAuth, requireRole('farmer'), updateProduct);
router.delete('/:id', requireAuth, requireRole('farmer'), deleteProduct);

export default router;
