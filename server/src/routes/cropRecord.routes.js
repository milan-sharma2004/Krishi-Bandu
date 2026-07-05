import { Router } from 'express';
import { listMyCropRecords, createCropRecord } from '../controllers/cropRecord.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, requireRole('farmer'), listMyCropRecords);
router.post('/', requireAuth, requireRole('farmer'), createCropRecord);

export default router;
