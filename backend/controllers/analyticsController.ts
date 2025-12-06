import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Property from '../models/Property';
import AuditLog from '../models/AuditLog';
import User from '../models/User';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.vendorId;

    const [propertyStats, userCount] = await Promise.all([
      Property.aggregate([
        { $match: { vendorId: vendorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      User.countDocuments({ vendorId })
    ]);

    const properties = {
      total: propertyStats.reduce((acc, curr) => acc + curr.count, 0),
      active: propertyStats.find(s => s._id === 'PUBLISHED' || s._id === 'ACTIVE')?.count || 0,
      sold: propertyStats.find(s => s._id === 'SOLD')?.count || 0,
      draft: propertyStats.find(s => s._id === 'DRAFT')?.count || 0
    };

    (res as any).json({
      properties,
      users: { total: userCount },
      revenue: 1250000 
    });
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const getPropertyTimeSeries = async (req: AuthRequest, res: Response) => {
  try {
    const data = [
      { date: '2023-10-01', count: 2 },
      { date: '2023-10-02', count: 0 },
      { date: '2023-10-03', count: 5 },
      { date: '2023-10-04', count: 3 },
      { date: '2023-10-05', count: 8 },
    ];
    (res as any).json(data);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find({ vendorId: req.vendorId })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('userId', 'firstName lastName email');
    
    (res as any).json(logs);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const exportAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find({ vendorId: req.vendorId })
      .sort({ timestamp: -1 })
      .populate('userId', 'email');

    const fields = ['Timestamp', 'Action', 'User', 'Target', 'Details'];
    const csvRows = logs.map(log => {
      const userEmail = (log.userId as any)?.email || 'System';
      const details = JSON.stringify(log.details).replace(/"/g, '""');
      return `"${log.timestamp.toISOString()}","${log.action}","${userEmail}","${log.targetModel}","${details}"`;
    });

    const csvContent = [fields.join(','), ...csvRows].join('\n');

    (res as any).header('Content-Type', 'text/csv');
    (res as any).attachment('audit-logs.csv');
    (res as any).send(csvContent);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};