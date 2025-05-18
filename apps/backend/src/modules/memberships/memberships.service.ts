import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';
import {
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { MembershipDTO } from './dto/membership.dto';
import { ErrorMessages } from 'src/utils/error-messages';
import { UsersService } from '../users/users.service';
import { UserMembership } from 'src/entities/user-membership.entity';
import { UserMembershipDTO } from './dto/user-membership.dto';

function mapToMembershipDTO(membership: Membership): MembershipDTO {
  return {
    membershipId: membership.membership_id,
    type: membership.type,
    price: membership.price,
    washTypeId: membership.washType.wash_type_id,
  };
}

function mapToUserMembershipDTO(
  userMembership: UserMembership,
): UserMembershipDTO {
  return {
    userMembershipId: userMembership.user_membership_id,
    startDate: userMembership.start_date,
    endDate: userMembership.end_date,
    membership: {
      membershipId: userMembership.membership.membership_id,
      type: userMembership.membership.type,
      price: Number(userMembership.membership.price),
      washTypeId: userMembership.membership.washType.wash_type_id,
    },
  };
}

@Injectable()
export class MembershipsService {
  private readonly logger = new Logger(MembershipsService.name);

  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(UserMembership)
    private readonly userMemberShipRepository: Repository<UserMembership>,
    private readonly usersService: UsersService,
  ) {}

  private async findUserMembership(
    trx: EntityManager,
    filter: FindOptionsWhere<UserMembership>,
    includeRelations: boolean = false,
  ): Promise<UserMembership | null> {
    const options: FindOneOptions<UserMembership> = { where: filter };
    if (includeRelations) {
      options.relations = ['membership', 'membership.washType'];
    }
    return await trx.findOne(UserMembership, options);
  }

  async getAll(): Promise<MembershipDTO[]> {
    this.logger.log('memberships: getAll');

    const memberships = await this.membershipRepository.find({
      relations: ['washType'],
    });

    if (!memberships || memberships.length === 0) {
      throw new NotFoundException(ErrorMessages.MEMBERSHIPS_NOT_FOUND);
    }

    return memberships.map((membership) => mapToMembershipDTO(membership));
  }

  async create(
    userId: number,
    membershipId: number,
  ): Promise<UserMembershipDTO> {
    this.logger.log('memberships: create');

    return await this.userMemberShipRepository.manager.transaction(
      async (trx) => {
        const user = await this.usersService.findById(userId);
        if (!user) {
          throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
        }

        const membershipType = await trx.findOne(Membership, {
          where: { membership_id: membershipId },
        });
        if (membershipType == null) {
          throw new NotFoundException(ErrorMessages.MEMBERSHIPS_NOT_FOUND);
        }

        const existingUserMembership = await this.findUserMembership(trx, {
          user: { user_id: userId },
        });

        if (existingUserMembership != null) {
          await trx.delete(
            UserMembership,
            existingUserMembership.user_membership_id,
          );
        }

        const newUserMembership = trx.create(UserMembership, {
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          user: { user_id: user.userId },
          membership: { membership_id: membershipType.membership_id },
        });

        await trx.save(newUserMembership);

        const savedUserMembership = await this.findUserMembership(
          trx,
          { user_membership_id: newUserMembership.user_membership_id },
          true,
        );

        if (savedUserMembership == null) {
          throw new NotFoundException(ErrorMessages.USER_MEMBERSHIP_NOT_FOUND);
        }

        return mapToUserMembershipDTO(savedUserMembership);
      },
    );
  }
}
