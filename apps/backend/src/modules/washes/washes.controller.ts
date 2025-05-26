import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WashesService } from './washes.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorMessages } from '../../utils/error-messages';
import { CreateWashSessionDTO } from './dto/create-wash-session.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('washes')
export class WashesController {
  constructor(private readonly washesService: WashesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all wash types' })
  @ApiResponse({
    status: 200,
    description: 'Wash types retrieved successfully',
  })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiResponse({ status: 404, description: ErrorMessages.WASH_TYPES_NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  washTypesGetAll() {
    return this.washesService.washTypesGetAll();
  }

  @Get('user')
  @ApiOperation({ summary: 'Get all user washes' })
  @ApiResponse({
    status: 200,
    description: 'User washes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiResponse({
    status: 404,
    description: ErrorMessages.USER_WASH_SESSIONS_NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard)
  async getUserWashes(@Req() req) {
    return this.washesService.getUserWashes(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create wash session' })
  @ApiResponse({
    status: 201,
    description: 'Wash session created successfully',
  })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
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
