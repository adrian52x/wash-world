import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 200, description: 'Signup successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() signupDto: SignUpDTO): Promise<{ accessToken: string }> {
    return await this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() loginDto: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
