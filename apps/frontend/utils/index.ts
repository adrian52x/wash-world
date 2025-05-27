import { MembershipTypeEnum, WashTypeEnum } from '@/types/enums';

const commonFeatures = [
  'Shampoo',
  'Drying',
  'Brush washing',
  'High-pressure flushing',
  'Wheel wash',
  'Rinsing wash',
];

export const getWashFeatures = (type: WashTypeEnum | MembershipTypeEnum) => {
  switch (type) {
    case WashTypeEnum.Gold:
    case MembershipTypeEnum.Gold:
      return commonFeatures;
    case WashTypeEnum.Premium:
    case MembershipTypeEnum.Premium:
      return [...commonFeatures, 'Undercarriage wash', 'Polishing'];
    case WashTypeEnum.Brilliant:
    case MembershipTypeEnum.Brilliant:
      return [
        ...commonFeatures,
        'Undercarriage wash',
        'Polishing',
        'Insect repellent',
        'Degreasing',
        'Foam splashing',
        'Extra drying',
      ];
    case WashTypeEnum.SelfWash:
      return [
        'High-pressure flushing',
        'Foam spreader',
        'Brush washing',
        'Rinsing with wax',
        'Spotless rinsing',
      ];
    default:
      return;
  }
};

export const displayRoleUI = (role: string) => {
  switch (role) {
    case 'REGULAR_USER':
      return 'Regular User';
    case 'PAID_USER':
      return 'Paid User';
    case 'ADMIN':
      return 'Administrator';
    default:
      return role;
  }
}