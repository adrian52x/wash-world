export enum MembershipTypeEnum {
  Gold = 'GOLD',
  Premium = 'PREMIUM',
  Brilliant = 'BRILLIANT',
}

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

export enum WashTypeEnum {
  Gold = 'GOLD',
  Premium = 'PREMIUM',
  Brilliant = 'BRILLIANT',
  SelfWash = 'SELF_WASH',
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
  email?: string;
  address?: string;
  phoneNumber?: string;
  licensePlate?: string;
}