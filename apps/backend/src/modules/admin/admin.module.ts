import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { LocationsModule } from '../locations/locations.module';

@Module({
  controllers: [AdminController],
  imports: [LocationsModule],
})
export class AdminModule {}
