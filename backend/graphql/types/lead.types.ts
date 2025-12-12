export const leadTypes = `
  type Lead {
    _id: ID!
    name: String!
    email: String!
    mobile: String
    status: LeadStatus!
    value: Float
    source: String
    assignedAgentId: ID
    vendorId: ID
    lastContact: String
    tags: [String!]
    notes: String
    scheduledViewingDate: String
    scheduledViewingNotes: String
    createdAt: String!
    updatedAt: String!
  }

  enum LeadStatus {
    NEW
    CONTACTED
    QUALIFIED
    PROPOSAL
    NEGOTIATION
    WON
    LOST
  }

  input LeadInput {
    name: String!
    email: String!
    mobile: String
    status: LeadStatus
    value: Float
    source: String
    assignedAgentId: ID
    tags: [String!]
    notes: String
  }

  input LeadUpdateInput {
    name: String
    email: String
    mobile: String
    status: LeadStatus
    value: Float
    source: String
    assignedAgentId: ID
    tags: [String!]
    notes: String
    scheduledViewingDate: String
    scheduledViewingNotes: String
  }

  input LeadFilterInput {
    status: LeadStatus
    assignedAgentId: ID
    vendorId: ID
    source: String
  }
`;

export const leadQueries = `
  leads(filter: LeadFilterInput): [Lead!]!
  lead(id: ID!): Lead
`;

export const leadMutations = `
  createLead(input: LeadInput!): Lead!
  updateLead(id: ID!, input: LeadUpdateInput!): Lead!
  deleteLead(id: ID!): Boolean!
`;
