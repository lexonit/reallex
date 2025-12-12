// Deal-related mutations
export const CREATE_DEAL_MUTATION = `
  mutation CreateDeal($input: DealInput!) {
    createDeal(input: $input) {
      _id
      name
      value
      stage
      probability
      closeDate
      leadId
      propertyId
      assignedAgentId
      createdAt
    }
  }
`;

export const UPDATE_DEAL_MUTATION = `
  mutation UpdateDeal($id: ID!, $input: DealUpdateInput!) {
    updateDeal(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_DEAL_MUTATION = `
  mutation DeleteDeal($id: ID!) {
    deleteDeal(id: $id)
  }
`;
