import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MembershipsModule } from './memberships/memberships.module';
import { WashesService } from './washes/washes.service';
import { WashesModule } from './washes/washes.module';
import { LocationsController } from './locations/locations.controller';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [UsersModule, AuthModule, MembershipsModule, WashesModule, LocationsModule],
  controllers: [AppController, LocationsController],
  providers: [AppService, UsersService, WashesService],
})
export class AppModule {}
