import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Locations not found' })
  getAll() {
    return this.locationsService.getAll();
  }
}
