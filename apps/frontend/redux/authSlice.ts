import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Role } from '@/types/enums';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';
import { storage } from '@/utils/storage';

// what we get from the decoded token
interface decodedToken {
  userId: number;
  email: string;
  role: Role;
}
interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthState {
  user: decodedToken | null;
  token: string | null;
  loading: boolean;
  errormessage: string | null;
  isAuthenticated: boolean;
}

// initial state of auth
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  errormessage: null,
  isAuthenticated: false,
};

// handle token decoding
const handleAuthSuccess = (token: string) => {
  const decodedToken = jwtDecode<decodedToken>(token);
  return {
    token,
    user: decodedToken,
    isAuthenticated: true,
  };
};

// to hydrate the user if there's data from the secure store
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = await storage.getToken();
  if (!token) throw new Error('No token found');

  return handleAuthSuccess(token);
});

const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:3000'
    : process.env.EXPO_PUBLIC_API_URL; // ip from .env

// make the api call here - a register thunk that gets the token
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

// Creaating the slice:
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      storage.removeToken();
      state.token = null;
      state.user = null;
      state.errormessage = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //signup
      .addCase(signup.fulfilled, (state, action) => {
        const auth = handleAuthSuccess(action.payload);
        state.token = auth.token;
        state.user = auth.user;
        state.isAuthenticated = true;
        state.errormessage = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.errormessage = action.error.message ?? 'Registration failed';
      })
      .addCase(login.fulfilled, (state, action) => {
        const auth = handleAuthSuccess(action.payload);
        state.token = auth.token;
        state.user = auth.user;
        state.isAuthenticated = true;
        state.errormessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.errormessage = action.error.message ?? 'Registration failed';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Selector to access token anywhere in the app
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer; // to add to the store
export const { logout } = authSlice.actions;
