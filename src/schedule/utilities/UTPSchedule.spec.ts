import { UTPSchedule } from "./UTPSchedule.js";
import { UTPConection } from "../../utilities/UTPconection.js";
import { Schedule } from "./UTPSchedule.dto.js";
import {parse} from 'node-html-parser';import dotenv from 'dotenv'

dotenv.config();

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;

describe("UTPSchedule object", ()=>{
    test("UTPSchedule debe extender de UTPConection", ()=>{
        const API = new UTPSchedule();
        expect(API).toBeInstanceOf(UTPConection);
    })
})

describe("UTPSchedule getSchedule", ()=>{
    test("getSchedule debe devolver un string parciable con la biblioteca parce", async ()=>{
        const API = new UTPSchedule();
        await API.getUtpInfo();
        API.curentUser = "p";
        expect(async () => parse(await API.getSchedule())).not.toThrow();
    })
    test("getSchedule debe navegar por si solo a utp.php", async ()=>{
        const API = new UTPSchedule();
        await API.validateUser("1004685950", "Pepeelmago123");
        await API.getSchedule();
        expect(API.utpPHP).toEqual(true);
    }, 20000)
})

describe("getScheduleFormat", ()=>{
    test("getScheduleFormat debe regresar almenos una materia", async ()=>{
        const API = new UTPSchedule();
        await API.validateUser(USER, PASSWORD);
        let materias:Array<Schedule> = await API.getScheduleFormat();
        expect(materias.length).toBeGreaterThan(1);
    }, 60000);
})