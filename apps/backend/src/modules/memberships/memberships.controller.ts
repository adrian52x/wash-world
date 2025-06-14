import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { ErrorMessages } from '../../utils/error-messages';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateUserMembershipDTO } from './dto/create-user-membership.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all membership' })
  @ApiResponse({ status: 200, description: 'Membership retrieved successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.MEMBERSHIPS_NOT_FOUND })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.membershipsService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership created successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_MEMBERSHIP_NOT_FOUND })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createUserMembershipDto: CreateUserMembershipDTO) {
    return this.membershipsService.create(req.user.userId, createUserMembershipDto.membershipId);
  }

  @Delete()
  @ApiOperation({ summary: 'Cancel user membership' })
  @ApiResponse({ status: 200, description: 'Membership cancelled successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_MEMBERSHIP_NOT_FOUND })
  @ApiResponse({ status: 401, description: ErrorMessages.UNAUTHORIZED })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  cancel(@Req() req) {
    return this.membershipsService.cancel(req.user.userId);
  }
}
