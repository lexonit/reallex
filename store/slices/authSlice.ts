import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { CurrentUser } from '../../types';
import { graphqlRequest } from '../../lib/graphql';
import { LOGIN_MUTATION } from '../../graphql/mutations/auth.mutations';
import { ME_QUERY } from '../../graphql/queries/auth.queries';

interface AuthState {
  user: CurrentUser | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
}

const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'lax' as const, // 'lax' allows cookie to persist across page reloads
  path: '/', // Ensure cookie is available across all routes
};

const initialState: AuthState = {
  user: null,
  token: Cookies.get(COOKIE_NAME) || null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(LOGIN_MUTATION, { input: { email, password } });
      const { token, user } = data.login;
      
      // Store token in cookie
      Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      
      const mappedUser: CurrentUser = {
        id: user._id,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
        email: user.email,
        role: user.role // Keep the original role from backend
      };
      
      return { token, user: mappedUser };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Read token from cookie
      const token = Cookies.get(COOKIE_NAME);
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      try {
        const data = await graphqlRequest(ME_QUERY);
        const user = data.me;
        
        const mappedUser: CurrentUser = {
          id: user._id,
          name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
          email: user.email,
          role: user.role // Keep the original role from backend
        };
        
        return { token, user: mappedUser };
      } catch (error: any) {
        // If ME_QUERY fails but token exists, still keep the token
        // Only clear if it's an auth error (401/403)
        if (error.message && (error.message.includes('Unauthorized') || error.message.includes('Forbidden'))) {
          Cookies.remove(COOKIE_NAME);
        }
        // Return partial success - keep user logged in with token
        // This prevents cookie deletion on network errors
        return rejectWithValue(error.message || 'Auth check failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Auth check failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Remove token from cookie
    Cookies.remove(COOKIE_NAME);
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: CurrentUser }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<{ token: string; user: CurrentUser }>) => {
        state.isCheckingAuth = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        // Only clear token if it was actually removed from cookies
        // This prevents clearing token on network errors
        const tokenInCookie = Cookies.get(COOKIE_NAME);
        if (!tokenInCookie) {
          state.token = null;
          state.user = null;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
