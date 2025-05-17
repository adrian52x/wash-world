import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';
import { Repository } from 'typeorm';
import { MembershipDTO } from './dto/membership.dto';
import { ErrorMessages } from 'src/utils/error-messages';

function mapToMembershipDTO(membership: Membership): MembershipDTO {
  return {
    membershipId: membership.membership_id,
    type: membership.type,
    price: membership.price,
    washTypeId: membership.washType.wash_type_id,
  };
}

@Injectable()
export class MembershipsService {
  private readonly logger = new Logger(MembershipsService.name);

  constructor(
    @InjectRepository(MembershipsService)
    private readonly membershipRepository: Repository<Membership>) { }

  async getAll(): Promise<MembershipDTO[]> {
    this.logger.log('memberships: getAll');

    const memberships = await this.membershipRepository.find();

    if (!memberships || memberships.length === 0) {
      throw new NotFoundException(ErrorMessages.MEMBERSHIPS_NOT_FOUND);
    }

    return memberships.map((membership) => mapToMembershipDTO(membership));
  }
}
