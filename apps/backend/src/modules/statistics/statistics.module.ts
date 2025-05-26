import { Module, forwardRef } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { WashesModule } from '../washes/washes.module';

@Module({
  imports: [forwardRef(() => WashesModule)],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
