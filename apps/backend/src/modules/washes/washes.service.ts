import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WashType } from '../../entities/wash-type.entity';
import { Wash } from '../../entities/wash.entity';
import { Repository } from 'typeorm';
import { WashTypeDTO } from './dto/wash-type.dto';
import { ErrorMessages } from '../../utils/error-messages';
import { CreateWashSessionDTO } from './dto/create-wash-session.dto';
import { UsersService } from '../users/users.service';
import {
  LocationsService,
  mapToLocationDTO,
} from '../locations/locations.service';
import { UserWashDTO } from './dto/user-wash-dto';
import { UserMembership } from 'src/entities/user-membership.entity';
import { MembershipsService } from '../memberships/memberships.service';

function mapToWashTypeDTO(washType: WashType): WashTypeDTO {
  return {
    washTypeId: washType.wash_type_id,
    type: washType.type,
    price: washType.price,
    description: washType.description,
    isAutoWash: washType.is_auto_wash,
  };
}

function mapToWashDTO(wash: Wash): UserWashDTO {
  return {
    washId: wash.wash_id,
    createdAt: wash.date_time,
    location: mapToLocationDTO(wash.location),
    washType: mapToWashTypeDTO(wash.washType),
    amountPaid: wash.amount_paid ?? 0,
  };
}

@Injectable()
export class WashesService {
  private readonly logger = new Logger(WashesService.name);

  constructor(
    @InjectRepository(WashType)
    private readonly washTypeRepository: Repository<WashType>,
    @InjectRepository(Wash)
    private readonly washRepository: Repository<Wash>,
    private readonly usersService: UsersService,
    private readonly locationsService: LocationsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  async washTypesGetAll(): Promise<WashTypeDTO[]> {
    // To dicuss this later
    this.logger.log('washTypes: getAll');

    const washTypes = await this.washTypeRepository.find();

    if (!washTypes || washTypes.length === 0) {
      throw new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND);
    }

    return washTypes.map((washType) => mapToWashTypeDTO(washType));
  }

  async washTypeGetById(washTypeId: number): Promise<WashTypeDTO> {
    this.logger.log(`washTypes: getById`);

    const washType = await this.washTypeRepository.findOne({
      where: { wash_type_id: washTypeId },
    });
    if (washType == null) {
      throw new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND);
    }
    return mapToWashTypeDTO(washType);
  }

  async getUserWashes(userId: number): Promise<UserWashDTO[]> {
    this.logger.log('washes: get user washes by userId');

    const washes = await this.washRepository.find({
      where: { user_id: userId },
      relations: ['washType', 'location'],
      order: { date_time: 'DESC' },
    });

    if (washes == null || washes.length === 0) {
      throw new NotFoundException(ErrorMessages.USER_WASH_SESSIONS_NOT_FOUND);
    }

    return washes.map((wash) => mapToWashDTO(wash));
  }

  async createWashSession(
    createWashSessionDto: CreateWashSessionDTO,
  ): Promise<{ success: boolean }> {
    this.logger.log('washes: createWashSession');

    const { userId, washTypeId, locationId } = createWashSessionDto;

    return await this.washRepository.manager.transaction(async (trx) => {
      const user = await this.usersService.findById(userId);
      if (user == null) {
        throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
      }

      const userMembership = await this.membershipsService.findUserMembership(
        trx,
        { user: { user_id: userId } },
        true,
      );

      const washType = await this.washTypeGetById(washTypeId);
      if (washType == null) {
        throw new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND);
      }

      const location = await this.locationsService.findById(locationId);
      if (location == null) {
        throw new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND);
      }

      let amountPaid = Number(washType.price);

      if (userMembership?.membership?.washType) {
        const membershipWashType = userMembership.membership.washType;
        const membershipWashPrice = Number(membershipWashType.price);
        const washPrice = Number(washType.price);

        if (membershipWashType.type === washType.type) {
          // same wash type as membership - free
          amountPaid = 0;
        } else if (membershipWashPrice < washPrice) {
          // higher tier wash - pay the difference
          amountPaid = washPrice - membershipWashPrice;
        }
        // lower tier wash - free
        else {
          amountPaid = 0;
        }
      }

      const wash = this.washRepository.create({
        user_id: user.userId,
        washType: { wash_type_id: washType.washTypeId },
        location: { location_id: location.locationId },
        date_time: new Date(),
        amount_paid: amountPaid,
      });

      const savedWash = await trx.save(wash);
      if (!savedWash) {
        return { success: false };
      }

      return { success: true };
    });
  }
}
