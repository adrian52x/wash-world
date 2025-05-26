import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationDTO } from './dto/location.dto';
import { ErrorMessages } from '../../utils/error-messages';

export function mapToLocationDTO(location: Location): LocationDTO {
  return {
    locationId: location.location_id,
    name: location.name,
    address: location.address,
    openingHours: location.opening_hours,
    autoWashHalls: location.auto_wash_halls,
    selfWashHalls: location.self_wash_halls,
    coordinates: location.coordinates,
  };
}

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getAll(): Promise<LocationDTO[]> {
    this.logger.log('locations: getAll');

    const locations = await this.locationRepository.find();

    if (!locations || locations.length === 0) {
      throw new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND);
    }

    return locations.map((location) => mapToLocationDTO(location));
  }

  async findById(locationId: number): Promise<LocationDTO> {
    this.logger.log(`locations: findById`);

    const location = await this.locationRepository.findOne({
      where: { location_id: locationId },
    });
    if (location == null) {
      throw new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND);
    }

    return mapToLocationDTO(location);
  }

  async update(
    locationId: number,
    updateLocationDto: Partial<LocationDTO>,
  ): Promise<{ success: boolean }> {
    this.logger.log(`locations: update`);

    const location = await this.locationRepository.findOne({
      where: { location_id: locationId },
    });

    if (!location) {
      throw new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND);
    }

    Object.assign(location, updateLocationDto);

    const updatedLocation = await this.locationRepository.save(location);

    if (!updatedLocation) {
      return { success: false };
    }

    return { success: true };
  }
}
