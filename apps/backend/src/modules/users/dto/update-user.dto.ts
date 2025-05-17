import { RoleEnum } from '../../../utils/enums';

export class UpdateUserDto {
  username: string;
  address: string;
  phoneNumber: string;
  licensePlate: string;
  password: string;
  role: RoleEnum;
}
