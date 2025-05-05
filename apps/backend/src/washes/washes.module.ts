import { Module } from '@nestjs/common';
import { WashesController } from './washes.controller';

@Module({
  controllers: [WashesController]
})
export class WashesModule {}
