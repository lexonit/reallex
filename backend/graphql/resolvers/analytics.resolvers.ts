import Property from '../../models/Property';
import User from '../../models/User';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

export const analyticsResolvers = {
  // Queries
  dashboardStats: async ({ vendorId }: any, context: any) => {
    requireAuth(context);
    const query: any = vendorId ? { vendorId } : {};
    
    const [totalProperties, activeUsers] = await Promise.all([
      Property.countDocuments(query),
      User.countDocuments({ ...query, isActive: true })
    ]);

    // Mock data for other stats (implement with real models when available)
    return {
      totalLeads: 0,
      totalProperties,
      totalDeals: 0,
      totalRevenue: 0,
      activeUsers,
      conversionRate: 0,
      averageDealSize: 0,
      pendingApprovals: 0
    };
  },

  propertyTimeSeries: async ({ timeRange, vendorId }: any, context: any) => {
    requireAuth(context);
    const query: any = vendorId ? { vendorId } : {};
    
    if (timeRange) {
      query.createdAt = {
        $gte: new Date(timeRange.startDate),
        $lte: new Date(timeRange.endDate)
      };
    }

    const properties = await Property.find(query);
    
    // Group by date and status
    const seriesMap: any = {};
    
    properties.forEach(prop => {
      const date = prop.createdAt?.toISOString().split('T')[0] || '';
      if (!seriesMap[date]) {
        seriesMap[date] = { date, published: 0, sold: 0, pending: 0 };
      }
      
      if (prop.status === 'PUBLISHED') seriesMap[date].published++;
      else if (prop.status === 'SOLD') seriesMap[date].sold++;
      else if (prop.status === 'PENDING') seriesMap[date].pending++;
    });

    return Object.values(seriesMap);
  },

  leadTimeSeries: async ({ timeRange, vendorId }: any, context: any) => {
    requireAuth(context);
    // Mock implementation - replace with real Lead model when available
    return [];
  },

  dealTimeSeries: async ({ timeRange, vendorId }: any, context: any) => {
    requireAuth(context);
    // Mock implementation - replace with real Deal model when available
    return [];
  },

  revenueByAgent: async ({ timeRange, vendorId }: any, context: any) => {
    requireAuth(context);
    // Mock implementation - replace with real Deal model when available
    return [];
  }
};
