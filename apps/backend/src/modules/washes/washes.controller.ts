import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WashesService } from './washes.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorMessages } from 'src/utils/error-messages';
import { CreateWashSessionDTO } from './dto/create-wash-session.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

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
  @UseGuards(JwtAuthGuard)
  washTypesGetAll() {
    return this.washesService.washTypesGetAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create wash session' })
  @ApiResponse({
    status: 201,
    description: 'Wash session created successfully',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessages.WASH_SESSION_CREATE_FAILED,
  })
  @UseGuards(JwtAuthGuard)
  async createWashSession(
    @Req() req,
    @Body() createWashSessionDto: CreateWashSessionDTO,
  ): Promise<{ success: boolean }> {
    const { washTypeId, locationId } = createWashSessionDto;

    return this.washesService.createWashSession({
      userId: req.user.userId,
      washTypeId,
      locationId,
    });
  }
}
