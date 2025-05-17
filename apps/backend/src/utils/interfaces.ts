import { Request } from 'express';
import { RoleEnum } from './enums';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: RoleEnum;
  };
}
