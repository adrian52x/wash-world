import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/password.utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    console.log('create user route hittt');
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Find the user
    const user = await this.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // if there's a pass in the update DTO - hash it
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    // Update the user
    await this.userRepository.update(userId, updateUserDto);
    return this.findOne(userId);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
