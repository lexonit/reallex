export const analyticsTypes = `
  type DashboardStats {
    totalLeads: Int!
    totalProperties: Int!
    totalDeals: Int!
    totalRevenue: Float!
    activeUsers: Int!
    conversionRate: Float
    averageDealSize: Float
    pendingApprovals: Int
  }

  type PropertyTimeSeries {
    date: String!
    published: Int!
    sold: Int!
    pending: Int!
  }

  type LeadTimeSeries {
    date: String!
    new: Int!
    qualified: Int!
    converted: Int!
  }

  type DealTimeSeries {
    date: String!
    won: Int!
    lost: Int!
    value: Float!
  }

  type RevenueByAgent {
    agentId: ID!
    agentName: String
    totalRevenue: Float!
    dealCount: Int!
  }

  input TimeRangeInput {
    startDate: String!
    endDate: String!
  }
`;

export const analyticsQueries = `
  dashboardStats(vendorId: ID): DashboardStats!
  propertyTimeSeries(timeRange: TimeRangeInput, vendorId: ID): [PropertyTimeSeries!]!
  leadTimeSeries(timeRange: TimeRangeInput, vendorId: ID): [LeadTimeSeries!]!
  dealTimeSeries(timeRange: TimeRangeInput, vendorId: ID): [DealTimeSeries!]!
  revenueByAgent(timeRange: TimeRangeInput, vendorId: ID): [RevenueByAgent!]!
`;

export const analyticsMutations = `
  # Analytics are computed, no mutations needed
`;
