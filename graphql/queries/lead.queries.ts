// Lead-related queries
export const GET_LEADS_QUERY = `
  query GetLeads($filter: LeadFilterInput) {
    leads(filter: $filter) {
      _id
      name
      email
      mobile
      status
      source
      value
      assignedAgentId
      notes
      scheduledViewingDate
      scheduledViewingNotes
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAD_QUERY = `
  query GetLead($id: ID!) {
    lead(id: $id) {
      _id
      name
      email
      mobile
      status
      source
      value
      assignedAgentId
      notes
      scheduledViewingDate
      scheduledViewingNotes
      createdAt
      updatedAt
    }
  }
`;
