export const roleTitleTypes = `
  type RoleTitle {
    _id: ID!
    title: String!
    systemRole: UserRole!
    description: String
    vendorId: ID!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input RoleTitleInput {
    title: String!
    systemRole: UserRole!
    description: String
    vendorId: ID!
  }

  input RoleTitleUpdateInput {
    title: String
    systemRole: UserRole
    description: String
    isActive: Boolean
  }

  input RoleTitleFilterInput {
    vendorId: ID
    systemRole: UserRole
    isActive: Boolean
  }
`;

export const roleTitleQueries = `
  roleTitles(filter: RoleTitleFilterInput): [RoleTitle!]!
  roleTitle(id: ID!): RoleTitle
`;

export const roleTitleMutations = `
  createRoleTitle(input: RoleTitleInput!): RoleTitle!
  updateRoleTitle(id: ID!, input: RoleTitleUpdateInput!): RoleTitle!
  deleteRoleTitle(id: ID!): Boolean!
`;
