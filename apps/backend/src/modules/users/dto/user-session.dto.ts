import { UserMembershipDTO } from 'src/modules/memberships/dto/user-membership.dto';
import { UserDTO } from './user.dto';

export class UserSessionDTO {
  user: UserDTO;
  userMembership: UserMembershipDTO | null;
}
