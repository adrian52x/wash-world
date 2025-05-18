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
    type: wash.washType.type,
    description: wash.washType.description,
    price: wash.washType.price,
    isAutoWash: wash.washType.is_auto_wash,
    location: mapToLocationDTO(wash.location),
    washType: mapToWashTypeDTO(wash.washType),
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
  ) {}

  async washTypesGetAll(): Promise<WashTypeDTO[]> {
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

      const washType = await this.washTypeGetById(washTypeId);
      if (washType == null) {
        throw new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND);
      }

      const location = await this.locationsService.findById(locationId);
      if (location == null) {
        throw new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND);
      }

      const wash = this.washRepository.create({
        user_id: user.userId,
        washType: { wash_type_id: washType.washTypeId },
        location: { location_id: location.locationId },
        date_time: new Date(),
      });

      const savedWash = await trx.save(wash);
      if (!savedWash) {
        return { success: false };
      }

      return { success: true };
    });
  }
}
