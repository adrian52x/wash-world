import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorMessages } from '../../utils/error-messages';
import { UsersService } from '../../modules/users/users.service';
import { SignUpDTO } from './dto/signup.dto';
import { User } from '../../entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '../../utils/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(userDto: LoginDTO): Promise<{ accessToken: string }> {
    this.logger.log('auth: login');

    try {
      const validatedUser = await this.validateUser(
        userDto.email,
        userDto.password,
      );
      const payload = {
        userId: validatedUser.user_id,
        email: validatedUser.email,
        role: validatedUser.role,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken: accessToken,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }
  }

  async signup(user: SignUpDTO): Promise<{ accessToken: string }> {
    this.logger.log('auth: signup');

    try {
      const existingUser = await this.usersService.findByEmail(user.email);

      if (existingUser) {
        throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = await this.usersService.create({
        ...user,
        role: RoleEnum.RegularUser,
        password: hashedPassword,
      });

      if (!newUser) {
        throw new InternalServerErrorException(
          ErrorMessages.UNKNOWN_REGISTER_ERROR,
        );
      }

      return this.login({
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        ErrorMessages.UNKNOWN_REGISTER_ERROR,
      );
    }
  }
}
