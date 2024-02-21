import { UTPConection } from "../../utilities/UTPConection.js";
import { Schedule, ScheduleItem } from "./UTPSchedule.dto.js";
import { conectionError } from "../../utilities/errores.js";
import {parse} from 'node-html-parser';
import { magic } from "./../../utilities/UTPMagicStrings.js";

/**
 * @name `UTPScheduleINTERFACE`
 * @interface
 * @description esta interface sirve para guardar los metodos para poder tener un marco de referencia
 */
interface UTPScheduleINTERFACE {
    /**
     * @name getSchedule
     * @description obtiene el html donde esta contenido la descripcion del horario
     */
    getSchedule():Promise<string>;

    /**
     * @name getScheduleFormat
     * @description crea un array con el horario siguiendo el formato de `Schedule`
     */
    getScheduleFormat():Promise<Array<Schedule>>;
}

/**
 * @name `UTPSchedule`
 * @class
 * @extends {UTPConection}
 * @description crea un objeto el cual tiene los metodos para obtener el horario de cualquier
 * usuario de la plataforma de la utp
 */
class UTPSchedule extends UTPConection implements UTPScheduleINTERFACE{

    /**
     * @constructor
     * @description llama al constructor de la clase padre `UTPConection`
     */
    constructor(){
        super()
    }
    async getSchedule(): Promise<string> {
        if(!this.utpPHP){
            await this.navigateIntoUtpPHP();
        }
        let limitTime = setTimeout(()=>{
            throw new conectionError("tiempo limite excedido");
        }, 10000);
        return fetch("https://app4.utp.edu.co/MatAcad/verificacion/horario.php", {
            "headers": {
              "cookie": this.cookieId
            },
            "body": null,
            "method": "POST"
        }).then(result=>{
            clearTimeout(limitTime);
            if (!result.ok) {
                throw new conectionError("error al obtener el horario del usuario");
            }
            return result.text();
        }).then(text=>{
            return text;
        });
    }
    async getScheduleFormat(): Promise<Array<Schedule>> {
        let d = await this.getSchedule();
        let html = parse(d);
        let elementos = html.querySelectorAll(magic.scheduleFormatField)[2].text.split("\n");
        elementos.shift();
        elementos.shift();
        let data:Array<Schedule> = []
        for(let i = 0; i < elementos.length; i += 2){
            let top:string = "";
            if(elementos[i][0] == ' '){
                top = elementos[i].substring(2, elementos[i].length);
            }else{
                top = elementos[i];
            }
            let info:Schedule = {
                codigo: "",
                grupo: 0,
                nombre: "",
                fechas: []
            }
            info.codigo = top.substring(0, 5);
            info.grupo = parseInt(top.substring(top.length - 1, top.length));
            info.nombre = top.substring(5, top.length - 6).replace(" ", "");
            if(i+1 >= elementos.length)
                break;
            info.fechas = elementos[i+1]
            .substring(0, elementos[i+1].length - 3)
            .split(",").map((horario)=>{
                if(horario[0] == ' '){
                    horario = horario.substring(1, horario.length);
                }
                let separado:Array<string>;
                if(horario[7] == " "){
                    separado = horario.substring(magic.goodScheduleBeginDay, horario.length).split(" ");
                }else{
                    separado = horario.substring(magic.badScheduleBeginDay, horario.length).split(" ");
                }
                let fecha:ScheduleItem = {
                    dia:"",
                    inicio:"",
                    final:"",
                    salon:""
                };
                fecha.dia = separado[magic.dayPos];
                fecha.inicio = separado[magic.startHour];
                fecha.final = separado[magic.endHour];
                fecha.salon = horario.substring(magic.classroomLowBounds, magic.classroomHighBounds);
                return fecha;
            });
            data.push(info);
        }
        return data;
    }
}

export {UTPSchedule}