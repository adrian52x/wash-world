import { Controller, Get } from '@nestjs/common';
import { WashesService } from './washes.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('washes')
export class WashesController {
  constructor(private readonly washesService: WashesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all membership' })
  @ApiResponse({ status: 200, description: 'Membership retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  washTypesGetAll() {
    return this.washesService.washTypesGetAll();
  }
}
