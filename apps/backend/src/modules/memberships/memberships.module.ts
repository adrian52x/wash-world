import { forwardRef, Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from '../../entities/membership.entity';
import { UsersModule } from '../users/users.module';
import { UserMembership } from '../../entities/user-membership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, UserMembership]),
    forwardRef(() => UsersModule),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
