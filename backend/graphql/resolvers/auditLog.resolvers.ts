import AuditLog from '../../models/AuditLog';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

export const auditLogResolvers = {
  // Queries
  auditLogs: async ({ filter, limit = 100, offset = 0 }: any, context: any) => {
    requireAuth(context);
    const query: any = {};
    
    if (filter) {
      if (filter.vendorId) query.vendorId = filter.vendorId;
      if (filter.userId) query.userId = filter.userId;
      if (filter.action) query.action = filter.action;
      if (filter.targetModel) query.targetModel = filter.targetModel;
      if (filter.startDate || filter.endDate) {
        query.timestamp = {};
        if (filter.startDate) query.timestamp.$gte = new Date(filter.startDate);
        if (filter.endDate) query.timestamp.$lte = new Date(filter.endDate);
      }
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset);

    return logs.map(log => ({
      _id: log._id.toString(),
      vendorId: log.vendorId?.toString(),
      userId: log.userId?.toString(),
      action: log.action,
      targetModel: log.targetModel,
      targetId: log.targetId?.toString(),
      details: log.details,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp.toISOString()
    }));
  },

  auditLog: async ({ id }: any, context: any) => {
    requireAuth(context);
    const log = await AuditLog.findById(id);
    if (!log) return null;

    return {
      _id: log._id.toString(),
      vendorId: log.vendorId?.toString(),
      userId: log.userId?.toString(),
      action: log.action,
      targetModel: log.targetModel,
      targetId: log.targetId?.toString(),
      details: log.details,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp.toISOString()
    };
  }
};
