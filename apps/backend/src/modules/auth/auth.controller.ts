import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginResponse } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() loginDto: SignUpDTO): Promise<LoginResponse> {
    return await this.authService.register(loginDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDTO): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}
