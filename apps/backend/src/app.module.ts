import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { WashesService } from './modules/washes/washes.service';
import { WashesModule } from './modules/washes/washes.module';
import { LocationsController } from './modules/locations/locations.controller';
import { LocationsModule } from './modules/locations/locations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'data-source';
import { LoggerMiddleware } from 'logger/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    AuthModule,
    MembershipsModule,
    WashesModule,
    LocationsModule,
  ],
  controllers: [AppController, LocationsController],
  providers: [AppService, WashesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
