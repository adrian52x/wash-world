import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { ErrorMessages } from 'src/utils/error-messages';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all membership' })
  @ApiResponse({
    status: 200,
    description: 'Membership retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.MEMBERSHIPS_NOT_FOUND,
  })
  getAll() {
    return this.membershipsService.getAll();
  }
}
