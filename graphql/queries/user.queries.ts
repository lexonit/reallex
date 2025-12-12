// User-related queries
export const GET_USERS_QUERY = `
  query GetUsers($filter: UserFilterInput) {
    users(filter: $filter) {
      _id
      email
      firstName
      lastName
      role
      vendorId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      _id
      email
      firstName
      lastName
      role
      vendorId
      isActive
      lastLogin
      createdAt
      updatedAt
    }
  }
`;

export const VERIFY_INVITE_TOKEN_QUERY = `
  query VerifyInviteToken($token: String!) {
    verifyInviteToken(token: $token) {
      email
      firstName
      lastName
      role
      isValid
    }
  }
`;

