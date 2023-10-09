import { Controller, Post, Get, Param } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';
import { Schedule } from '../utilities/UTPSchedule.dto.js';

@Controller('schedule')
export class ScheduleController {
    constructor(private API:ScheduleService){}
    @Get()
    getResponse(){
        return "<h1>ok</h1>"
    }
    @Get(":user/:password")
    async getSchedule(@Param("user") user:string, @Param("password") password:string){
        let info:Array<Schedule> = await this.API.getScheduleFormat(user, password);
        return info;
    }
}
