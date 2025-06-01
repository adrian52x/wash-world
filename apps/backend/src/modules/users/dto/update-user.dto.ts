import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../../utils/enums';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'Username of user', required: false })
  username?: string;

  @ApiProperty({ example: 'Nørrebrogade 1, 2200 København N', description: 'Address of user', required: false })
  address?: string;

  @ApiProperty({ example: '+4512345678', description: 'Phone number of user', required: false })
  phoneNumber?: string;

  @ApiProperty({ example: 'AB12345', description: 'License plate user car', required: false })
  licensePlate?: string;

  @ApiProperty({ example: 'newPassword123', description: 'Password of user', required: false })
  password?: string;

  @ApiProperty({ enum: RoleEnum, example: RoleEnum.PaidUser, description: 'Role of user', required: false })
  role?: RoleEnum;
}
