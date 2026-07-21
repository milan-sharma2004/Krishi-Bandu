import { Router } from 'express';
import { createComplaint, listMyComplaints, listComplaints, updateComplaint } from '../controllers/complaint.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createComplaint);
router.get('/mine', requireAuth, listMyComplaints);
router.get('/', requireAuth, requireRole('admin'), listComplaints);
router.patch('/:id', requireAuth, requireRole('admin'), updateComplaint);

export default router;
