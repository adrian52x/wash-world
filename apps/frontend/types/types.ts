import { MembershipTypeEnum, RoleEnum, WashTypeEnum } from './enums';

export interface Membership {
  membershipId: number;
  type: MembershipTypeEnum;
  price: string;
  washTypeId: number;
}

export interface UserMembership {
  startDate: string;
  endDate: string | null;
  membership: Membership;
}

export interface WashType {
  washTypeId: number;
  type: WashTypeEnum;
  price: string;
  description: string;
  isAutoWash: boolean;
}

export interface WashSession {
  washId: number;
  createdAt: string; // ISO date string
  location: Location;
  washType: WashType;
  amountPaid: number;
}

export interface InsertWash {
  washTypeId: number;
  locationId: number;
}

export interface Coordinates {
  x: string;
  y: string;
}

export interface Location {
  locationId: number;
  name: string;
  address: string;
  openingHours: string;
  autoWashHalls: number;
  selfWashHalls: number;
  coordinates: Coordinates;
}

export interface UpdateUser {
  username?: string;
  address?: string;
  phoneNumber?: string;
  licensePlate?: string;
  password?: string;
  role?: RoleEnum;
}
