import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule/schedule.service.js';
import { ScheduleController } from './schedule/schedule.controller.js';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule {}
