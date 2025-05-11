import { Role } from 'src/utils/enums';

export type LoginResponse = {
  user: {
    id: number;
    email: string;
    username: string;
    role: Role;
    accessToken: string;
  };
}
