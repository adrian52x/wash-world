import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/utils/error-messages';
import { UsersService } from 'src/modules/users/users.service';
import { SignUpDTO } from './dto/signup.dto';
import { User } from 'src/entities/user.entity';
import { hashPassword } from 'src/utils/password.utils';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginResponse } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // to validate the user when logging in
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password); //compare is async

    if (!isMatch) {
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(user: LoginDTO): Promise<LoginResponse> {
    try {
      const validatedUser = await this.validateUser(user.email, user.password);
      const payload = { id: validatedUser.user_id, email: validatedUser.email };
      const accessToken = this.jwtService.sign(payload);

      const userWithoutPassword = {
        ...JSON.parse(JSON.stringify(validatedUser)),
        password: undefined,
        access_token: accessToken,
      };
      return {
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }
  }

  async register(user: SignUpDTO): Promise<any> {
    try {
      // Check for existing user
      const existingUser = await this.usersService.findOneByEmail(user.email);
      if (existingUser) {
        throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(user.password);
      const newUser = await this.usersService.create({
        ...user,
        password: hashedPassword,
      });

      if (!newUser) {
        throw new InternalServerErrorException(
          ErrorMessages.UNKNOWN_REGISTER_ERROR,
        );
      }

      // make login handle token generation and response formatting
      return this.login({
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // for debugging
      console.error('Registration error:', error);
      // generic message to client
      throw new InternalServerErrorException(
        ErrorMessages.UNKNOWN_REGISTER_ERROR,
      );
    }
  }
}
