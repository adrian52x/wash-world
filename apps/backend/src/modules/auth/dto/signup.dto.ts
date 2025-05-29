import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Use a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}