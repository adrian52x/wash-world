import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from 'src/entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';

@Module({
  providers: [LocationsService],
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
