import { MembershipTypeEnum } from "src/utils/enums";

export class MembershipDTO {
  membershipId: number;
  type: MembershipTypeEnum;
  price: number;
  washTypeId: number;
}
