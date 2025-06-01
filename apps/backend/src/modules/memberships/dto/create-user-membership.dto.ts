import { ApiProperty } from '@nestjs/swagger';

export class CreateUserMembershipDTO {
  @ApiProperty({ example: 1, description: 'ID of the membership to create', required: true })
  membershipId: number;
}
