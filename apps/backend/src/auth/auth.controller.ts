import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerBody: CreateUserDto): Promise<CreateUserDto> {
    return await this.authService.register(registerBody);
  }

  @Post('login')
  async login(@Body() loginBody: LoginDto): Promise<any> {
    return this.authService.login(loginBody);
  }
}
