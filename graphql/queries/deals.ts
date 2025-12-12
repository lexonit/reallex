export const GET_DEALS_QUERY = /* GraphQL */ `
query Deals($filter: DealsFilter) {
  deals(filter: $filter) {
    _id
    title
    value
    stage
    probability
    propertyId
    ownerId
    vendorId
    createdAt
    updatedAt
  }
}
`;

export const GET_DEAL_QUERY = /* GraphQL */ `
query Deal($id: ID!) {
  deal(id: $id) {
    _id
    title
    value
    stage
    probability
    propertyId
    ownerId
    vendorId
    createdAt
    updatedAt
  }
}
`;
