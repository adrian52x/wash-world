import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaidUserGuard } from '../guards/paid-user.guard';

export function PaidUser() {
  return applyDecorators(UseGuards(AuthGuard('jwt'), PaidUserGuard));
}
