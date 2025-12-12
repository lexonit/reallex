// Lead-related mutations
export const CREATE_LEAD_MUTATION = `
  mutation CreateLead($input: LeadInput!) {
    createLead(input: $input) {
      _id
      name
      email
      mobile
      status
      source
      value
      assignedAgentId
      createdAt
    }
  }
`;

export const UPDATE_LEAD_MUTATION = `
  mutation UpdateLead($id: ID!, $input: LeadUpdateInput!) {
    updateLead(id: $id, input: $input) {
      _id
      name
      email
      mobile
      status
      source
      value
      assignedAgentId
      notes
      updatedAt
    }
  }
`;

export const DELETE_LEAD_MUTATION = `
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id)
  }
`;

export const CONVERT_LEAD_TO_DEAL_MUTATION = `
  mutation ConvertLeadToDeal($leadId: ID!) {
    convertLeadToDeal(leadId: $leadId) {
      _id
      name
      value
      stage
      leadId
      createdAt
    }
  }
`;
