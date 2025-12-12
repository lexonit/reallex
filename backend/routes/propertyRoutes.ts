import express from 'express';
import { createProperty, getProperties, submitProperty, approveProperty, rejectProperty } from '../controllers/propertyController';
import {
  getPendingApprovals,
  approvePropertyForListing,
  rejectPropertySubmission,
  getNotifications,
  markNotificationAsRead,
  getPropertyApprovalStatus
} from '../controllers/approvalController';
import { authenticate } from '../middleware/auth';
import { resolveTenant } from '../middleware/tenant';
import { authorize } from '../rbac';
import { UserRole } from '../models/User';
import { checkSubscriptionLimits } from '../middleware/subscription';

const router = express.Router();

router.use(authenticate as any, resolveTenant as any);

router.get('/', getProperties as any);
router.post('/', checkSubscriptionLimits('property') as any, createProperty as any);

router.post('/:id/submit', submitProperty as any);

// Old approve/reject endpoints (kept for compatibility)
router.post('/:id/approve', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, approveProperty as any);
router.post('/:id/reject', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, rejectProperty as any);

router.post('/:id/approvals/approve', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, approvePropertyForListing as any);
router.post('/:id/approvals/reject', authorize([UserRole.MANAGER, UserRole.VENDOR_ADMIN]) as any, rejectPropertySubmission as any);
router.get('/:id/approvals/status', getPropertyApprovalStatus as any);

// Notification endpoints
router.get('/notifications/list', getNotifications as any);
router.post('/notifications/:id/read', markNotificationAsRead as any);

export default router;