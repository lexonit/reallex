export const CREATE_ROLE_TITLE_MUTATION = `
  mutation CreateRoleTitle($input: RoleTitleInput!) {
    createRoleTitle(input: $input) {
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

export const UPDATE_ROLE_TITLE_MUTATION = `
  mutation UpdateRoleTitle($id: ID!, $input: RoleTitleUpdateInput!) {
    updateRoleTitle(id: $id, input: $input) {
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

export const DELETE_ROLE_TITLE_MUTATION = `
  mutation DeleteRoleTitle($id: ID!) {
    deleteRoleTitle(id: $id)
  }
`;
