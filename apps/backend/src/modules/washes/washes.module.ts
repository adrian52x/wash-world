import { Module, forwardRef } from '@nestjs/common';
import { WashesController } from './washes.controller';
import { WashType } from '../../entities/wash-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wash } from '../../entities/wash.entity';
import { WashesService } from './washes.service';
import { UsersModule } from '../users/users.module';
import { LocationsModule } from '../locations/locations.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WashType, Wash]),
    forwardRef(() => UsersModule),
    LocationsModule,
    forwardRef(() => StatisticsModule)
  ],
  controllers: [WashesController],
  providers: [WashesService],
  exports: [WashesService],
})
export class WashesModule { }