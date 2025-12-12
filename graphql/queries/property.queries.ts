// Property-related queries
export const GET_PROPERTIES_QUERY = `
  query GetProperties($filter: PropertyFilterInput) {
    properties(filter: $filter) {
      _id
      address
      price
      specs {
        beds
        baths
        sqft
        lotSize
      }
      status
      description
      images
      yearBuilt
      garage
      taxes
      hoaFees
      amenities
      documents
      assignedAgentId
      assignedAgent { _id email firstName lastName }
      approvalStatus
      vendorId
      location {
        type
        coordinates
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROPERTY_QUERY = `
  query GetProperty($id: ID!) {
    property(id: $id) {
      _id
      address
      price
      specs {
        beds
        baths
        sqft
        lotSize
      }
      status
      description
      images
      yearBuilt
      garage
      taxes
      hoaFees
      amenities
      location {
        type
        coordinates
      }
      documents
      location {
        type
        coordinates
      }
      assignedAgentId
      assignedAgent { _id email firstName lastName }
      approvalStatus
      vendorId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PENDING_APPROVALS_QUERY = `
  query GetPendingApprovals {
    getPendingApprovals {
      _id
      address
      price
      specs {
        beds
        baths
        sqft
        lotSize
      }
      status
      description
      images
      yearBuilt
      garage
      taxes
      hoaFees
      amenities
      documents
      assignedAgentId
      assignedAgent { _id email firstName lastName }
      vendorId
      approvalStatus
      createdAt
      updatedAt
    }
  }
`;
