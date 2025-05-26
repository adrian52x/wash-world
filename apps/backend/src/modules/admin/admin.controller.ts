import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { LocationsService } from '../locations/locations.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from '../auth/decorators/admin.decorator';
import { LocationDTO } from '../locations/dto/location.dto';
import { ErrorMessages } from 'src/utils/error-messages';

@Controller('admin')
export class AdminController {
  constructor(private readonly locationsService: LocationsService) {}

  @Patch('locations/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiResponse({ status: 404, description: ErrorMessages.LOCATIONS_NOT_FOUND })
  @Admin()
  async update(
    @Param('id') locationId: number,
    @Body() updateLocationDto: Partial<LocationDTO>,
  ) {
    return this.locationsService.update(locationId, updateLocationDto);
  }
}
