import { Router } from 'express';
import { getSellerShop } from '../controllers/seller.controller.js';

const router = Router();

router.get('/:id', getSellerShop);

export default router;
