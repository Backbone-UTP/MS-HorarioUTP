import { Injectable } from '@nestjs/common';
import { UTPSchedule } from '../utilities/UTPSchedule.js';
import { Schedule } from '../utilities/UTPSchedule.dto.js';

@Injectable()
export class ScheduleService {

    private API:UTPSchedule;

    constructor(){
        this.API = new UTPSchedule();
    }

    async getSchedule(usuario:string, contraseña:string){
        await this.API.validateUser(usuario, contraseña);
        let info:string = await this.API.getSchedule();
        this.API.endSessionUser();
        return info;
    }

    async getScheduleFormat(usuario:string, contraseña:string){
        await this.API.validateUser(usuario, contraseña);
        let info:Array<Schedule> = await this.API.getScheduleFormat();
        this.API.endSessionUser();
        return info;
    }

}
