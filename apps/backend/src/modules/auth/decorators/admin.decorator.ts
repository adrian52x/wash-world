import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';

export function Admin() {
  return applyDecorators(UseGuards(AuthGuard('jwt'), AdminGuard));
}
