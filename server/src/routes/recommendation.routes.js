import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getRecommendations);

export default router;
