import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/modules/users/users.service';

dotenv.config();

type PayloadDto = {
  userId: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: PayloadDto) {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: user.role,
    };
  }
}
