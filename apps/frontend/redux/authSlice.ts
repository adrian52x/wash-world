import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Role } from '@/types/enums';
import { jwtDecode } from 'jwt-decode';

// what we get from the decoded token
interface User {
  userId: number;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  errormessage: string | null;
  isAuthenticated: boolean;
}

// initial state for the authentication
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  errormessage: null,
  isAuthenticated: false,
};

// to type the data of the request
class SignupRequest {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}
}
class LoginRequest {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

// Helper to handle token decoding
const handleAuthSuccess = (token: string) => {
  const decodedToken = jwtDecode<User>(token);
  return {
    token,
    user: decodedToken,
    isAuthenticated: true,
  };
};

// make the api call here - a register thunk that gets the token
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest) => {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Sign-up failed. Try againnn');
    }

    const data = await response.json();
    return data.accessToken; // This includes the token now
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: LoginRequest) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data || 'Login failed');
    }
    return data.accessToken;
  },
);

// Creaating the slice:
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
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
      });
  },
});

// Selector to access token anywhere in the app
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

// exporting it cause we need it in the store
export default authSlice.reducer;
export const { logout } = authSlice.actions;
