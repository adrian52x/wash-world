import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/password.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { User } from 'src/entities/user.entity';

//TODO: We could have a better place for this function
function mapToUserDTO(user: User): UserDTO {
  return {
      username: user.username,
      email: user.email,
      address: user.address,
      phoneNumber: user.phone_number,
      licensePlate: user.license_plate,
      role: user.role,
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
      throw new NotFoundException('No users found');
    }

    return users.map((user) => (mapToUserDTO(user)));
  }

  async findById(userId: number): Promise<UserDTO> {
    this.logger.log(`users: findById`);

    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return mapToUserDTO(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

    async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDTO> {
    return await this.userRepository.manager.transaction(async (trx) => {
      this.logger.log(`users: updateUser`);

      const user = await trx.findOne(User, { where: { user_id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      if (updateUserDto.password) {
        updateUserDto.password = await hashPassword(updateUserDto.password);
      }
  
      const updatedUser = {
        username: updateUserDto.username,
        address: updateUserDto.address,
        phone_number: updateUserDto.phoneNumber,
        license_plate: updateUserDto.licensePlate,
        role: updateUserDto.role,
      };
  
      await trx.update(User, userId, updatedUser);
  
      const updatedUserEntity = await trx.findOne(User, { where: { user_id: userId } });
      if (!updatedUserEntity) {
        throw new NotFoundException('User not found');
      }
  
      return mapToUserDTO(updatedUserEntity);
    });
  }

  async remove(userId: number): Promise<void> {
    this.logger.log(`users: remove`);
    
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.delete(userId);
  }
}
