import { Role } from './enums';

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

// user types

export interface WashType {
  id: number;
  name: string;
  description: string;
}

export interface Membership {
  id: number;
  type: string;
  price: number;
  washType: WashType;
}

export interface UserMembership {
  startDate: string;
  endDate: string | null;
  membership: Membership;
}

export interface UserSessionData {
  username: string;
  email: string;
  address: string | null;
  phoneNumber: string | null;
  licensePlate: string | null;
  role: Role;
  userMembership: UserMembership | null;
}
