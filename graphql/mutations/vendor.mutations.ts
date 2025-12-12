// Vendor-related mutations
export const CREATE_VENDOR_MUTATION = `
  mutation CreateVendor($input: VendorInput!) {
    createVendor(input: $input) {
      _id
      name
      slug
      logoUrl
      contactEmail
      theme {
        primaryColor
      }
      subscription {
        _id
        status
        planName: plan {
          name
          price
        }
      }
      createdAt
    }
  }
`;

export const UPDATE_VENDOR_MUTATION = `
  mutation UpdateVendor($id: ID!, $input: VendorUpdateInput!) {
    updateVendor(id: $id, input: $input) {
      _id
      name
      slug
      logoUrl
      contactEmail
      theme {
        primaryColor
      }
      updatedAt
    }
  }
`;

export const DELETE_VENDOR_MUTATION = `
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id)
  }
`;
