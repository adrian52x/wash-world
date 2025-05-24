import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { storage } from '@/utils/storage';
import {
  AuthState,
  LoginRequest,
  SignupRequest,
} from '@/types/auth.types';

// initial state of auth
const initialState: AuthState = {
  token: null,
  loading: false,
  errormessage: null,
  isAuthenticated: false,
  userSession: null,
};

// const handleAuthSuccess = (token: string) => {
//   return {
//     token,
//     isAuthenticated: true,
//   };
// };

// to hydrate the user if there's data from the secure store
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = await storage.getToken();
  if (!token) throw new Error('No token found');

  return { token };
});

const API_URL = process.env.EXPO_PUBLIC_API_URL;

console.log('API_URL:', API_URL);


export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Sign-up failed. Try againnn');
    }

    const data = await response.json();
    await storage.setToken(data.accessToken);
    return data.accessToken; // This includes the token now
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: LoginRequest) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data || 'Login failed');
    }

    await storage.setToken(data.accessToken);
    return data.accessToken;
  },
);

export const fetchUserSession = createAsyncThunk(
  'auth/fetchUserSession',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await fetch(`${API_URL}/users/current-session`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user session');
    }

    return await response.json();
  },
);

// Creaating the slice:
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      storage.removeToken();
      state.token = null;
      state.errormessage = null;
      state.isAuthenticated = false;
      state.userSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //signup
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.errormessage = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.errormessage = action.error.message ?? 'Registration failed';
      })
      //login
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.errormessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.errormessage = action.error.message ?? 'Registration failed';
      })
      //initialiizeAuth
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      })
      //fetchUserSession
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.userSession = action.payload;
        state.loading = false;
        state.errormessage = null;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.userSession = null;
        state.loading = false;
        state.errormessage =
          action.error.message ?? 'Failed to fetch user data';
      })
      .addCase(fetchUserSession.pending, (state) => {
        state.loading = true;
      });
  },
});

// Selector to access state anywhere in the app
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUserSession = (state: RootState) => state.auth.userSession;

export default authSlice.reducer;
export const { logout } = authSlice.actions;
