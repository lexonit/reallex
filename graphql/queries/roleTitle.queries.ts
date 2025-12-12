export const GET_ROLE_TITLES_QUERY = `
  query GetRoleTitles($filter: RoleTitleFilterInput) {
    roleTitles(filter: $filter) {
      _id
      title
      systemRole
      description
      vendorId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ROLE_TITLE_QUERY = `
  query GetRoleTitle($id: ID!) {
    roleTitle(id: $id) {
      _id
      title
      systemRole
      description
      vendorId
      isActive
      createdAt
      updatedAt
    }
  }
`;
