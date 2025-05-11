import { Role } from 'src/users/entity/user-role.enum';

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    username: string;
    role: Role;
    access_token: string;
  };
}
