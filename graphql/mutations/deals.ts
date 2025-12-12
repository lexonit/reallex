export const CREATE_DEAL_MUTATION = /* GraphQL */ `
mutation CreateDeal($input: CreateDealInput!) {
  createDeal(input: $input) {
    _id
    title
    value
    stage
    probability
    propertyId
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_DEAL_MUTATION = /* GraphQL */ `
mutation UpdateDeal($id: ID!, $input: UpdateDealInput!) {
  updateDeal(id: $id, input: $input) {
    _id
    title
    value
    stage
    probability
    propertyId
    updatedAt
  }
}
`;

export const DELETE_DEAL_MUTATION = /* GraphQL */ `
mutation DeleteDeal($id: ID!) {
  deleteDeal(id: $id)
}
`;
