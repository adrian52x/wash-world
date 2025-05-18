import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WashType } from 'src/entities/wash-type.entity';
import { Wash } from 'src/entities/wash.entity';
import { Repository } from 'typeorm';
import { WashTypeDTO } from './dto/wash-type.dto';
import { ErrorMessages } from 'src/utils/error-messages';

function mapToWashTypeDTO(washType: WashType): WashTypeDTO {
  return {
    washTypeId: washType.wash_type_id,
    type: washType.type,
    price: washType.price,
    description: washType.description,
    isAutoWash: washType.is_auto_wash,
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
  ) {}

  async washTypesGetAll(): Promise<WashTypeDTO[]> {
    this.logger.log('washTypes: getAll');

    const washTypes = await this.washTypeRepository.find();

    if (!washTypes || washTypes.length === 0) {
      throw new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND);
    }

    return washTypes.map((washType) => mapToWashTypeDTO(washType));
  }
}
