import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ErrorMessages } from '../../utils/error-messages';
import { UserSessionDTO } from './dto/user-session.dto';

function mapToUserDTO(user: User): UserDTO {
  return {
    userId: user.user_id,
    username: user.username,
    email: user.email,
    address: user.address,
    phoneNumber: user.phone_number,
    licensePlate: user.license_plate,
    role: user.role,
  };
}

function mapToUserSessionDTO(user: User): UserSessionDTO {
  const userDTO: UserDTO = {
    userId: user.user_id,
    username: user.username,
    email: user.email,
    address: user.address,
    phoneNumber: user.phone_number,
    licensePlate: user.license_plate,
    role: user.role,
  };

  const userMembershipDTO = user.userMembership
    ? {
        userMembershipId: user.userMembership.user_membership_id,
        startDate: user.userMembership.start_date,
        endDate: user.userMembership.end_date,
        membership: {
          membershipId: user.userMembership.membership.membership_id,
          type: user.userMembership.membership.type,
          price: Number(user.userMembership.membership.price),
          washTypeId: user.userMembership.membership.washType.wash_type_id,
        },
      }
    : null;

  return {
    user: userDTO,
    userMembership: userMembershipDTO,
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    this.logger.log('users: create');

    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserDTO[]> {
    this.logger.log('users: findAll');

    const users = await this.userRepository.find();

    if (!users || users.length === 0) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    return users.map((user) => mapToUserDTO(user));
  }

  async findById(userId: number): Promise<UserDTO> {
    this.logger.log(`users: findById`);

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    return mapToUserDTO(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUserEmail(email: string): Promise<{ isValid: boolean }> {
    this.logger.log(`users: validateUserEmail`);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      return { isValid: true };
    }

    return { isValid: false };
  }

  async getCurrentSession(userId: number): Promise<UserSessionDTO> {
    this.logger.log(`users: getCurrentSession`);

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: {
        userMembership: {
          membership: {
            washType: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    return mapToUserSessionDTO(user);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDTO> {
    return await this.userRepository.manager.transaction(async (trx) => {
      this.logger.log(`users: updateUser`);

      const user = await trx.findOne(User, { where: { user_id: userId } });
      if (!user) {
        throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = {};
      if (updateUserDto.username !== undefined)
        updatedUser['username'] = updateUserDto.username;
      if (updateUserDto.address !== undefined)
        updatedUser['address'] = updateUserDto.address;
      if (updateUserDto.phoneNumber !== undefined)
        updatedUser['phone_number'] = updateUserDto.phoneNumber;
      if (updateUserDto.licensePlate !== undefined)
        updatedUser['license_plate'] = updateUserDto.licensePlate;
      if (updateUserDto.role !== undefined)
        updatedUser['role'] = updateUserDto.role;

      await trx.update(User, userId, updatedUser);

      const updatedUserEntity = await trx.findOne(User, {
        where: { user_id: userId },
      });
      if (!updatedUserEntity) {
        throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
      }

      return mapToUserDTO(updatedUserEntity);
    });
  }

  async remove(userId: number): Promise<void> {
    this.logger.log(`users: remove`);

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    await this.userRepository.delete(userId);
  }
}
