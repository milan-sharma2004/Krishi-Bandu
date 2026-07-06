import { Router } from 'express';
import { register, login, me, updateMe, changePassword } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateMe);
router.post('/change-password', requireAuth, changePassword);

export default router;
