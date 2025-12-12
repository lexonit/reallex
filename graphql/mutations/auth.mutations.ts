// Auth-related mutations
export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($input: UserInput!) {
    register(input: $input) {
      token
      user {
        _id
        email
        firstName
        lastName
        role
        vendorId
      }
    }
  }
`;
