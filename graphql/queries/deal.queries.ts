// Deal-related queries
export const GET_DEALS_QUERY = `
  query GetDeals($filter: DealFilterInput) {
    deals(filter: $filter) {
      _id
      name
      value
      stage
      probability
      closeDate
      leadId
      propertyId
      assignedAgentId
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_DEAL_QUERY = `
  query GetDeal($id: ID!) {
    deal(id: $id) {
      _id
      name
      value
      stage
      probability
      closeDate
      leadId
      propertyId
      assignedAgentId
      notes
      createdAt
      updatedAt
    }
  }
`;
