import { Role } from './enums';
import { UserMembership } from './types';

export interface DecodedToken {
  userId: number;
  email: string;
  role: Role;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  errormessage: string | null;
  isAuthenticated: boolean;
  userSession: UserSessionData | null;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  address: string | null;
  phoneNumber: string | null;
  licensePlate: string | null;
  role: Role;
}

export interface UserSessionData {
  user: User;
  userMembership: UserMembership | null;
}
