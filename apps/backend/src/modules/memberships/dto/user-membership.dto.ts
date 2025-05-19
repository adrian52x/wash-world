import { MembershipDTO } from './membership.dto';

export class UserMembershipDTO {
  userMembershipId: number;
  startDate: Date;
  endDate: Date;
  membership: MembershipDTO;
}
