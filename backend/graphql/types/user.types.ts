export const userTypes = `
  type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    role: UserRole!
    vendorId: ID
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    SUPER_ADMIN
    VENDOR_ADMIN
    MANAGER
    SALES_REP
    CLIENT
  }

  input UserInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
    role: UserRole!
    vendorId: ID
    vendorName: String
    vendorSlug: String
    contactEmail: String
    logoUrl: String
    theme: VendorThemeInput
    planId: ID
  }

  input UserUpdateInput {
    email: String
    firstName: String
    lastName: String
    role: UserRole
    isActive: Boolean
  }

  input UserFilterInput {
    role: UserRole
    vendorId: ID
    isActive: Boolean
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type InvitePayload {
    inviteToken: String!
    email: String!
    expiresAt: String!
  }

  type InviteDetails {
    email: String!
    firstName: String
    lastName: String
    role: UserRole!
    isValid: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input InviteUserInput {
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    vendorId: ID
  }

  input AcceptInviteInput {
    token: String!
    password: String!
    firstName: String
    lastName: String
  }
`;

export const userQueries = `
  users(filter: UserFilterInput): [User!]!
  user(id: ID!): User
  me: User
  verifyInviteToken(token: String!): InviteDetails!
`;

export const userMutations = `
  register(input: UserInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  inviteUser(input: InviteUserInput!): InvitePayload!
  acceptInvite(input: AcceptInviteInput!): AuthPayload!
  updateUser(id: ID!, input: UserUpdateInput!): User!
  deleteUser(id: ID!): Boolean!
`;
