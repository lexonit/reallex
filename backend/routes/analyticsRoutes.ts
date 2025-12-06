import express from 'express';
import { getDashboardStats, getPropertyTimeSeries, getAuditLogs, exportAuditLogs } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { resolveTenant } from '../middleware/tenant';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(authenticate as any, resolveTenant as any);

const adminOnly = authorize([UserRole.SUPER_ADMIN, UserRole.VENDOR_ADMIN, UserRole.MANAGER]);

router.get('/stats', adminOnly as any, getDashboardStats as any);
router.get('/timeseries/properties', adminOnly as any, getPropertyTimeSeries as any);
router.get('/audit-logs', adminOnly as any, getAuditLogs as any);
router.get('/export/audit-logs', adminOnly as any, exportAuditLogs as any);

export default router;