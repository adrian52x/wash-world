import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../../users/entity/user-role.enum';

@Injectable()
export class GoldUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ExecutionContext gives access to request details
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user?.role === Role.GoldUser;
  }
}
