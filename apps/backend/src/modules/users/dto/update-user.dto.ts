import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from '../../../utils/enums';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  role: Role;
}
