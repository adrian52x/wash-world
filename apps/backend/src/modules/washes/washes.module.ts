import { Module } from '@nestjs/common';
import { WashesController } from './washes.controller';
import { WashType } from 'src/entities/wash-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wash } from 'src/entities/wash.entity';
import { WashesService } from './washes.service';

@Module({
  imports: [TypeOrmModule.forFeature([WashType, Wash])],
  controllers: [WashesController],
  providers: [WashesService],
  exports: [WashesService],
})

export class WashesModule { }
