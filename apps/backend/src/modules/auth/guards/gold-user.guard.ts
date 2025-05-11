import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../../utils/enums';

@Injectable()
export class GoldUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== Role.GoldUser) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
