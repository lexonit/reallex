// Property-related mutations
export const CREATE_PROPERTY_MUTATION = `
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
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
      location {
        type
        coordinates
      }
      createdAt
    }
  }
`;

export const UPDATE_PROPERTY_MUTATION = `
  mutation UpdateProperty($id: ID!, $input: PropertyUpdateInput!) {
    updateProperty(id: $id, input: $input) {
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
      location {
        type
        coordinates
      }
      updatedAt
    }
  }
`;

export const DELETE_PROPERTY_MUTATION = `
  mutation DeleteProperty($id: ID!, $reason: String) {
    deleteProperty(id: $id, reason: $reason)
  }
`;
