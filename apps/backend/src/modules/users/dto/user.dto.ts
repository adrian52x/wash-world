import { RoleEnum } from 'src/utils/enums';

export class UserDTO {
  userId: number;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  licensePlate: string;
  role: RoleEnum;
}
