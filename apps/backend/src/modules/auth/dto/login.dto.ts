import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginDTO {
  @IsEmail({}, { message: 'Use a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
