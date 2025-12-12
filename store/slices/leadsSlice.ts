import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lead } from '../../types';
import { graphqlRequest } from '../../lib/graphql';
import { GET_LEADS_QUERY } from '../../graphql/queries/lead.queries';
import { CREATE_LEAD_MUTATION, UPDATE_LEAD_MUTATION, DELETE_LEAD_MUTATION } from '../../graphql/mutations/lead.mutations';

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
};

// Helper to convert backend status to UI status
const toUiStatus = (backendStatus: string): Lead['status'] => {
  const map: Record<string, Lead['status']> = {
    'NEW': 'New',
    'CONTACTED': 'Contacted',
    'QUALIFIED': 'Qualified',
    'CONVERTED': 'Converted',
    'LOST': 'Lost'
  };
  return map[backendStatus] || 'New';
};

const toBackendStatus = (uiStatus: Lead['status']): string => {
  const map: Record<Lead['status'], string> = {
    'New': 'NEW',
    'Contacted': 'CONTACTED',
    'Qualified': 'QUALIFIED',
    'Converted': 'CONVERTED',
    'Lost': 'LOST'
  };
  return map[uiStatus] || 'NEW';
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params: { filter?: any; userId?: string; userRole?: string } = {}, { rejectWithValue }) => {
    try {
      // If user is an agent, filter by assigned agent ID
      const filter = params.userRole === 'AGENT' && params.userId 
        ? { ...params.filter, assignedAgentId: params.userId }
        : params.filter || {};
      
      const data = await graphqlRequest(GET_LEADS_QUERY, { filter });
      return data.leads.map((l: any) => ({
        id: l._id,
        name: l.name,
        email: l.email,
        mobile: l.mobile,
        status: toUiStatus(l.status),
        value: l.value || 0,
        source: l.source || 'Website',
        assignedAgent: l.assignedAgentId,
        lastContact: l.lastContact || '',
        tags: l.tags || [],
        notes: l.notes || '',
        scheduledViewingDate: l.scheduledViewingDate || null,
        scheduledViewingNotes: l.scheduledViewingNotes || ''
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leads');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (input: Partial<Lead>, { rejectWithValue }) => {
    try {
      const backendInput = {
        name: input.name,
        email: input.email,
        mobile: input.mobile,
        status: input.status ? toBackendStatus(input.status) : 'NEW',
        value: input.value,
        source: input.source,
        assignedAgentId: input.assignedAgent,
        tags: input.tags
      };
      const data = await graphqlRequest(CREATE_LEAD_MUTATION, { input: backendInput });
      const l = data.createLead;
      return {
        id: l._id,
        name: l.name,
        email: l.email,
        mobile: l.mobile,
        status: toUiStatus(l.status),
        value: l.value || 0,
        source: l.source || 'Website',
        assignedAgent: l.assignedAgentId,
        lastContact: l.lastContact || '',
        tags: l.tags || [],
        notes: l.notes || '',
        scheduledViewingDate: l.scheduledViewingDate || null,
        scheduledViewingNotes: l.scheduledViewingNotes || ''
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, input }: { id: string; input: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const backendInput = {
        name: input.name,
        email: input.email,
        mobile: input.mobile,
        status: input.status ? toBackendStatus(input.status) : undefined,
        value: input.value,
        source: input.source,
        assignedAgentId: input.assignedAgent,
        tags: input.tags,
        notes: input.notes,
        scheduledViewingDate: (input as any).scheduledViewingDate,
        scheduledViewingNotes: (input as any).scheduledViewingNotes
      };
      const data = await graphqlRequest(UPDATE_LEAD_MUTATION, { id, input: backendInput });
      const l = data.updateLead;
      return {
        id: l._id,
        name: l.name,
        email: l.email,
        mobile: l.mobile,
        status: toUiStatus(l.status),
        value: l.value || 0,
        source: l.source || 'Website',
        assignedAgent: l.assignedAgentId,
        lastContact: l.lastContact || '',
        tags: l.tags || [],
        notes: l.notes || '',
        scheduledViewingDate: l.scheduledViewingDate || null,
        scheduledViewingNotes: l.scheduledViewingNotes || ''
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      await graphqlRequest(DELETE_LEAD_MUTATION, { id });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Lead
      .addCase(createLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.leads.push(action.payload);
      })
      // Update Lead
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        const index = state.leads.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.leads = state.leads.filter(l => l.id !== action.payload);
      });
  },
});

export const { clearError, setSelectedLead } = leadsSlice.actions;
export default leadsSlice.reducer;
