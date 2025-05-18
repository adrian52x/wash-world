import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ErrorMessages } from '../../utils/error-messages';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_NOT_FOUND })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('current-session')
  @ApiOperation({ summary: 'Get user current session with membership info' })
  @ApiResponse({
    status: 200,
    description: 'User session retrieved successfully',
  })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  usersCurrentSession(@Req() req) {
    return this.usersService.getCurrentSession(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.userId, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: ErrorMessages.USER_NOT_FOUND })
  remove(@Req() req) {
    return this.usersService.remove(req.user.userId);
  }
}
