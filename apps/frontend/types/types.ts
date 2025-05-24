export enum MembershipTypeEnum {
  Gold = 'GOLD',
  Premium = 'PREMIUM',
  Brilliant = 'BRILLIANT',
}

export enum WashTypeEnum {
  Gold = 'GOLD',
  Premium = 'PREMIUM',
  Brilliant = 'BRILLIANT',
  SelfWash = 'SELF_WASH',
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

export interface Membership {
  membershipId: number;
  type: MembershipTypeEnum;
  price: number;
  washTypeId: number;
}
