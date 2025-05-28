import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateEmailDTO } from './dto/validate-email.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'Signup successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() signupDto: SignUpDTO): Promise<{ accessToken: string }> {
    return await this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() loginDto: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('validate-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate user email' })
  @ApiResponse({ status: 200, description: 'Email validated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async validateUserEmail(@Body() validateEmailDto: ValidateEmailDTO): Promise<{ isValid: boolean }> {
    return await this.usersService.validateUserEmail(validateEmailDto.email);
  }
}
