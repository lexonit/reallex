export const vendorTypes = `
  type Vendor {
    _id: ID!
    name: String!
    slug: String!
    logoUrl: String
    theme: VendorTheme
    contactEmail: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type VendorTheme {
    primaryColor: String
    secondaryColor: String
    logoUrl: String
  }

  input VendorInput {
    name: String!
    slug: String!
    logoUrl: String
    theme: VendorThemeInput
    contactEmail: String
    planId: ID
  }

  input VendorThemeInput {
    primaryColor: String
    secondaryColor: String
    logoUrl: String
  }

  input VendorUpdateInput {
    name: String
    logoUrl: String
    theme: VendorThemeInput
    contactEmail: String
    isActive: Boolean
  }
`;

export const vendorQueries = `
  vendors: [Vendor!]!
  vendor(id: ID!): Vendor
  vendorBySlug(slug: String!): Vendor
`;

export const vendorMutations = `
  createVendor(input: VendorInput!): Vendor!
  updateVendor(id: ID!, input: VendorUpdateInput!): Vendor!
  deleteVendor(id: ID!): Boolean!
`;
