import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { graphqlRequest } from '../../lib/graphql';
import { 
  GET_VENDORS_QUERY, 
  GET_VENDOR_QUERY 
} from '../../graphql/queries/vendor.queries';
import { 
  CREATE_VENDOR_MUTATION, 
  UPDATE_VENDOR_MUTATION, 
  DELETE_VENDOR_MUTATION 
} from '../../graphql/mutations/vendor.mutations';

interface VendorTheme {
  primaryColor: string;
}

export interface Vendor {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  contactEmail: string;
  isActive: boolean;
  theme?: VendorTheme;
  createdAt?: string;
  updatedAt?: string;
}

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(GET_VENDORS_QUERY);
      return data.vendors;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendor = createAsyncThunk(
  'vendor/fetchVendor',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(GET_VENDOR_QUERY, { id });
      return data.vendor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vendor');
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (
    input: {
      name: string;
      slug: string;
      contactEmail: string;
      logoUrl?: string;
      theme?: { primaryColor: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await graphqlRequest(CREATE_VENDOR_MUTATION, { input });
      return data.createVendor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create vendor');
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async (
    {
      id,
      input,
    }: {
      id: string;
      input: Partial<{
        name: string;
        slug: string;
        contactEmail: string;
        logoUrl: string;
        theme: { primaryColor: string };
        isActive: boolean;
      }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await graphqlRequest(UPDATE_VENDOR_MUTATION, { id, input });
      return data.updateVendor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update vendor');
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(DELETE_VENDOR_MUTATION, { id });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete vendor');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action: PayloadAction<Vendor[]>) => {
        state.isLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Single Vendor
    builder
      .addCase(fetchVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.isLoading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Vendor
    builder
      .addCase(createVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.isLoading = false;
        state.vendors.push(action.payload);
        state.currentVendor = action.payload;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Vendor
    builder
      .addCase(updateVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.isLoading = false;
        const index = state.vendors.findIndex((v) => v._id === action.payload._id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.currentVendor?._id === action.payload._id) {
          state.currentVendor = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Vendor
    builder
      .addCase(deleteVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.vendors = state.vendors.filter((v) => v._id !== action.payload);
        if (state.currentVendor?._id === action.payload) {
          state.currentVendor = null;
        }
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
