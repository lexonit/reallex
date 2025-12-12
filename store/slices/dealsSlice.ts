import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '../../types';
import { graphqlRequest } from '../../lib/graphql';
import { GET_DEALS_QUERY } from '../../graphql/queries/deal.queries';
import { CREATE_DEAL_MUTATION, UPDATE_DEAL_MUTATION, DELETE_DEAL_MUTATION } from '../../graphql/mutations/deal.mutations';

interface DealsState {
  deals: Deal[];
  selectedDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  deals: [],
  selectedDeal: null,
  isLoading: false,
  error: null,
};

// Helper to convert backend stage to UI stage
const toUiStage = (backendStage: string): Deal['stage'] => {
  const map: Record<string, Deal['stage']> = {
    'LEAD': 'Lead',
    'QUALIFIED': 'Qualified',
    'PROPOSAL': 'Proposal',
    'NEGOTIATION': 'Negotiation',
    'CLOSING': 'Closing',
    'WON': 'Won',
    'LOST': 'Lost'
  };
  return map[backendStage] || 'Lead';
};

const toBackendStage = (uiStage: Deal['stage']): string => {
  const map: Record<Deal['stage'], string> = {
    'Lead': 'LEAD',
    'Qualified': 'QUALIFIED',
    'Proposal': 'PROPOSAL',
    'Negotiation': 'NEGOTIATION',
    'Closing': 'CLOSING',
    'Won': 'WON',
    'Lost': 'LOST'
  };
  return map[uiStage] || 'LEAD';
};

// Async thunks
export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async (filter?: any, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(GET_DEALS_QUERY, { filter });
      return data.deals.map((d: any) => ({
        id: d._id,
        name: d.name,
        value: d.value || 0,
        stage: toUiStage(d.stage),
        closeDate: d.closeDate || new Date().toISOString(),
        probability: d.probability || 0,
        leadId: d.leadId,
        propertyId: d.propertyId,
        agentId: d.assignedAgentId,
        agentName: d.assignedAgentId,
        notes: d.notes
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch deals');
    }
  }
);

export const createDeal = createAsyncThunk(
  'deals/createDeal',
  async (input: Partial<Deal>, { rejectWithValue }) => {
    try {
      const backendInput = {
        name: input.name,
        value: input.value,
        stage: input.stage ? toBackendStage(input.stage) : 'LEAD',
        closeDate: input.closeDate,
        probability: input.probability,
        leadId: input.leadId,
        propertyId: input.propertyId,
        assignedAgentId: input.agentId,
        notes: input.notes
      };
      const data = await graphqlRequest(CREATE_DEAL_MUTATION, { input: backendInput });
      const d = data.createDeal;
      return {
        id: d._id,
        name: d.name,
        value: d.value || 0,
        stage: toUiStage(d.stage),
        closeDate: d.closeDate || new Date().toISOString(),
        probability: d.probability || 0,
        leadId: d.leadId,
        propertyId: d.propertyId,
        agentId: d.assignedAgentId,
        agentName: d.assignedAgentId,
        notes: d.notes
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create deal');
    }
  }
);

export const updateDeal = createAsyncThunk(
  'deals/updateDeal',
  async ({ id, input }: { id: string; input: Partial<Deal> }, { rejectWithValue }) => {
    try {
      const backendInput = {
        name: input.name,
        value: input.value,
        stage: input.stage ? toBackendStage(input.stage) : undefined,
        closeDate: input.closeDate,
        probability: input.probability,
        leadId: input.leadId,
        propertyId: input.propertyId,
        assignedAgentId: input.agentId,
        notes: input.notes
      };
      const data = await graphqlRequest(UPDATE_DEAL_MUTATION, { id, input: backendInput });
      const d = data.updateDeal;
      return {
        id: d._id,
        name: d.name,
        value: d.value || 0,
        stage: toUiStage(d.stage),
        closeDate: d.closeDate || new Date().toISOString(),
        probability: d.probability || 0,
        leadId: d.leadId,
        propertyId: d.propertyId,
        agentId: d.assignedAgentId,
        agentName: d.assignedAgentId,
        notes: d.notes
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update deal');
    }
  }
);

export const deleteDeal = createAsyncThunk(
  'deals/deleteDeal',
  async (id: string, { rejectWithValue }) => {
    try {
      await graphqlRequest(DELETE_DEAL_MUTATION, { id });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete deal');
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDeal: (state, action: PayloadAction<Deal | null>) => {
      state.selectedDeal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Deals
      .addCase(fetchDeals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.isLoading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Deal
      .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.deals.push(action.payload);
      })
      // Update Deal
      .addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        const index = state.deals.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
      })
      // Delete Deal
      .addCase(deleteDeal.fulfilled, (state, action: PayloadAction<string>) => {
        state.deals = state.deals.filter(d => d.id !== action.payload);
      });
  },
});

export const { clearError, setSelectedDeal } = dealsSlice.actions;
export default dealsSlice.reducer;
