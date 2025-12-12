// Analytics-related queries
export const GET_ANALYTICS_QUERY = `
  query GetAnalytics($filter: AnalyticsFilterInput) {
    analytics(filter: $filter) {
      totalLeads
      totalDeals
      totalRevenue
      conversionRate
      averageDealValue
      leadsOverTime {
        date
        count
      }
      dealsOverTime {
        date
        count
        revenue
      }
      leadsBySource {
        source
        count
      }
      dealsByStage {
        stage
        count
        value
      }
    }
  }
`;
