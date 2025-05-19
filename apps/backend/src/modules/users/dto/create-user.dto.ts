import { RoleEnum } from 'src/utils/enums';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
}
