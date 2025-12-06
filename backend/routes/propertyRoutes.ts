import express from 'express';
import { createProperty, getProperties, submitProperty, approveProperty, rejectProperty } from '../controllers/propertyController';
import { authenticate } from '../middleware/auth';
import { resolveTenant } from '../middleware/tenant';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(authenticate as any, resolveTenant as any);

router.get('/', getProperties as any);
router.post('/', createProperty as any);

router.post('/:id/submit', submitProperty as any);

router.post('/:id/approve', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, approveProperty as any);
router.post('/:id/reject', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, rejectProperty as any);

export default router;