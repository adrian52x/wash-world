import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
