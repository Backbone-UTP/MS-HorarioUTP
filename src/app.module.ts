import { Module } from '@nestjs/common';
import { ScheduleModule } from './schedule/schedule.module.js';

@Module({
  imports: [ScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
