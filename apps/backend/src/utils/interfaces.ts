import { Request } from 'express';
import { Role } from './enums';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: Role;
  };
}
