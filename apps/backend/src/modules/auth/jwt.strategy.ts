import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/utils/enums';

type PayloadDto = {
  id: number;
  email: string;
  role: Role;
};

// token validation and payload extraction
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: PayloadDto) {
    return {
      id: payload.id,
      email: payload.email,
      // role: payload.role, // not good practice - from christian's slides
    };
  }
}
