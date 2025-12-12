// Vendor-related queries
export const GET_VENDORS_QUERY = `
  query GetVendors {
    vendors {
      _id
      name
      slug
      logoUrl
      contactEmail
      theme {
        primaryColor
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_VENDOR_QUERY = `
  query GetVendor($id: ID!) {
    vendor(id: $id) {
      _id
      name
      slug
      logoUrl
      contactEmail
      address
      theme {
        primaryColor
      }
      createdAt
      updatedAt
    }
  }
`;
