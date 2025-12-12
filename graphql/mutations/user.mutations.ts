// User-related mutations
export const CREATE_USER_MUTATION = `
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      _id
      email
      firstName
      lastName
      role
      vendorId
      isActive
      createdAt
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      _id
      email
      firstName
      lastName
      role
      vendorId
      isActive
      updatedAt
    }
  }
`;

export const INVITE_USER_MUTATION = `
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      inviteToken
      email
      expiresAt
    }
  }
`;

export const ACCEPT_INVITE_MUTATION = `
  mutation AcceptInvite($input: AcceptInviteInput!) {
    acceptInvite(input: $input) {
      token
      user {
        _id
        email
        firstName
        lastName
        role
        vendorId
        isActive
      }
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
