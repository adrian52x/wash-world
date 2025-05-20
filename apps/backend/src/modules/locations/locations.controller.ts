import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorMessages } from '../../utils/error-messages';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.LOCATIONS_NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.locationsService.getAll();
  }
  // get by id
  @Get('/:id')
  @ApiOperation({ summary: 'Get location by id' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: number) {
    return this.locationsService.findById(id);
  }
}
