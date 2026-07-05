import { Router } from 'express';
import { overview, listUsers, updateUserStatus } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/overview', overview);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);

export default router;
