import { Router } from 'express';
import {
  listMyCropRecords,
  createCropRecord,
  updateCropRecord,
  deleteCropRecord,
} from '../controllers/cropRecord.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, requireRole('farmer'), listMyCropRecords);
router.post('/', requireAuth, requireRole('farmer'), createCropRecord);
router.put('/:id', requireAuth, requireRole('farmer'), updateCropRecord);
router.delete('/:id', requireAuth, requireRole('farmer'), deleteCropRecord);

export default router;
