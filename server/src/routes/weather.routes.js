import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getWeather);

export default router;
