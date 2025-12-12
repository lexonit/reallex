export const dealTypes = `
  type Deal {
    _id: ID!
    name: String!
    value: Float!
    stage: DealStage!
    closeDate: String
    probability: Float
    leadId: ID
    propertyId: ID
    assignedAgentId: ID
    vendorId: ID
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  enum DealStage {
    PROSPECT
    QUALIFICATION
    PROPOSAL
    NEGOTIATION
    CLOSING
    WON
    LOST
  }

  input DealInput {
    name: String!
    value: Float!
    stage: DealStage
    closeDate: String
    probability: Float
    leadId: ID
    propertyId: ID
    assignedAgentId: ID
    notes: String
  }

  input DealUpdateInput {
    name: String
    value: Float
    stage: DealStage
    closeDate: String
    probability: Float
    leadId: ID
    propertyId: ID
    assignedAgentId: ID
    notes: String
  }

  input DealFilterInput {
    stage: DealStage
    assignedAgentId: ID
    vendorId: ID
    minValue: Float
    maxValue: Float
  }
`;

export const dealQueries = `
  deals(filter: DealFilterInput): [Deal!]!
  deal(id: ID!): Deal
`;

export const dealMutations = `
  createDeal(input: DealInput!): Deal!
  updateDeal(id: ID!, input: DealUpdateInput!): Deal!
  deleteDeal(id: ID!): Boolean!
`;
