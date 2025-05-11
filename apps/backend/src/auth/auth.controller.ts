import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerBody: CreateUserDto): Promise<LoginResponse> {
    return await this.authService.register(registerBody);
  }

  @Post('login')
  async login(@Body() loginBody: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginBody);
  }
}
