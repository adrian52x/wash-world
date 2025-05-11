import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from '../entity/user-role.enum';

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
