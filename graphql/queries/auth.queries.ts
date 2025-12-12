// Auth-related queries
export const ME_QUERY = `
  query Me {
    me {
      _id
      email
      firstName
      lastName
      role
      vendorId
      isActive
    }
  }
`;
