export const propertyTypes = `
  type Property {
    _id: ID!
    address: String!
    price: Float!
    specs: PropertySpecs
    status: PropertyStatus!
    description: String
    images: [String!]
    yearBuilt: Int
    garage: Int
    taxes: Float
    hoaFees: Float
    amenities: [String!]
    documents: [String!]
    location: Location
    vendorId: ID
    assignedAgentId: ID
    assignedAgent: User
    approvalStatus: String
    approvedBy: ID
    approvalDate: String
    rejectionReason: String
    createdAt: String!
    updatedAt: String!
  }

  type PropertySpecs {
    beds: Int
    baths: Float
    sqft: Int
    lotSize: Float
  }

  type Location {
    type: String
    coordinates: [Float!]
  }

  enum PropertyStatus {
    DRAFT
    PENDING
    PUBLISHED
    SOLD
    ARCHIVED
  }

  input PropertyInput {
    address: String!
    price: Float!
    specs: PropertySpecsInput
    status: PropertyStatus
    description: String
    images: [String!]
    yearBuilt: Int
    garage: Int
    taxes: Float
    hoaFees: Float
    amenities: [String!]
    documents: [String!]
    location: LocationInput
    assignedAgentId: ID
  }

  input PropertySpecsInput {
    beds: Int
    baths: Float
    sqft: Int
    lotSize: Float
  }

  input LocationInput {
    type: String
    coordinates: [Float!]
  }

  input PropertyUpdateInput {
    address: String
    price: Float
    specs: PropertySpecsInput
    status: PropertyStatus
    description: String
    images: [String!]
    yearBuilt: Int
    garage: Int
    taxes: Float
    hoaFees: Float
    amenities: [String!]
    documents: [String!]
    location: LocationInput
    assignedAgentId: ID
  }

  input PropertyFilterInput {
    status: PropertyStatus
    minPrice: Float
    maxPrice: Float
    minBeds: Int
    maxBeds: Int
    assignedAgentId: ID
    vendorId: ID
  }
`;

export const propertyQueries = `
  properties(filter: PropertyFilterInput): [Property!]!
  property(id: ID!): Property
`;

export const propertyMutations = `
  createProperty(input: PropertyInput!): Property!
  updateProperty(id: ID!, input: PropertyUpdateInput!): Property!
  deleteProperty(id: ID!, reason: String): Boolean!
`;
