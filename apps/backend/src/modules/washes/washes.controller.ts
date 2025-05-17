import { Controller, Get } from '@nestjs/common';
import { WashesService } from './washes.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorMessages } from 'src/utils/error-messages';

@Controller('washes')
export class WashesController {
  constructor(private readonly washesService: WashesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all wash types' })
  @ApiResponse({
    status: 200,
    description: 'Wash types retrieved successfully',
  })
  @ApiResponse({ status: 404, description: ErrorMessages.WASH_TYPES_NOT_FOUND })
  washTypesGetAll() {
    return this.washesService.washTypesGetAll();
  }
}
