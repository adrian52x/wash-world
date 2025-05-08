import { IsEmail, IsString, MinLength } from 'class-validator'; // Validation decorators

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
