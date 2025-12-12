import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../types';
import { graphqlRequest } from '../../lib/graphql';
import { GET_PROPERTIES_QUERY, GET_PROPERTY_QUERY } from '../../graphql/queries/property.queries';
import { CREATE_PROPERTY_MUTATION, UPDATE_PROPERTY_MUTATION, DELETE_PROPERTY_MUTATION } from '../../graphql/mutations/property.mutations';

interface PropertiesState {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PropertiesState = {
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
};

// Helper to convert backend status to UI status
const toUiStatus = (backendStatus: string): Property['status'] => {
  const map: Record<string, Property['status']> = {
    'DRAFT': 'Draft',
    'PENDING': 'Pending',
    'PUBLISHED': 'Active',
    'SOLD': 'Sold',
    'ARCHIVED': 'Archived'
  };
  return map[backendStatus] || 'Draft';
};

const toBackendStatus = (uiStatus: Property['status']): string => {
  const map: Record<Property['status'], string> = {
    'Draft': 'DRAFT',
    'Pending': 'PENDING',
    'Active': 'PUBLISHED',
    'Sold': 'SOLD',
    'Archived': 'ARCHIVED'
  };
  return map[uiStatus] || 'DRAFT';
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (filter?: any, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(GET_PROPERTIES_QUERY, { filter });
      return data.properties.map((p: any) => ({
        id: p._id,
        address: p.address,
        price: p.price,
        specs: p.specs,
        status: toUiStatus(p.status),
        description: p.description,
        images: p.images,
        location: p.location,
        vendorId: p.vendorId,
        assignedAgentId: p.assignedAgentId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch properties');
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchProperty',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(GET_PROPERTY_QUERY, { id });
      const p = data.property;
      return {
        id: p._id,
        address: p.address,
        price: p.price,
        specs: p.specs,
        status: toUiStatus(p.status),
        description: p.description,
        images: p.images,
        location: p.location,
        vendorId: p.vendorId,
        assignedAgentId: p.assignedAgentId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch property');
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (input: Partial<Property>, { rejectWithValue }) => {
    try {
      const backendInput = {
        ...input,
        status: input.status ? toBackendStatus(input.status) : 'DRAFT'
      };
      const data = await graphqlRequest(CREATE_PROPERTY_MUTATION, { input: backendInput });
      const p = data.createProperty;
      return {
        id: p._id,
        address: p.address,
        price: p.price,
        specs: p.specs,
        status: toUiStatus(p.status),
        description: p.description,
        images: p.images,
        location: p.location,
        vendorId: p.vendorId,
        assignedAgentId: p.assignedAgentId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, input }: { id: string; input: Partial<Property> }, { rejectWithValue }) => {
    try {
      const backendInput = {
        ...input,
        status: input.status ? toBackendStatus(input.status) : undefined
      };
      const data = await graphqlRequest(UPDATE_PROPERTY_MUTATION, { id, input: backendInput });
      const p = data.updateProperty;
      return {
        id: p._id,
        address: p.address,
        price: p.price,
        specs: p.specs,
        status: toUiStatus(p.status),
        description: p.description,
        images: p.images,
        location: p.location,
        vendorId: p.vendorId,
        assignedAgentId: p.assignedAgentId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (id: string, { rejectWithValue }) => {
    try {
      await graphqlRequest(DELETE_PROPERTY_MUTATION, { id });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete property');
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Property
      .addCase(fetchProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.selectedProperty = action.payload;
      })
      // Create Property
      .addCase(createProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.properties.push(action.payload);
      })
      // Update Property
      .addCase(updateProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      // Delete Property
      .addCase(deleteProperty.fulfilled, (state, action: PayloadAction<string>) => {
        state.properties = state.properties.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, setSelectedProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
