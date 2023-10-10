import {parse} from 'node-html-parser';
import { UTPInfoInput } from './UTP.dto.js';
import { conectionError, missingError, userError } from './errores.js';
import { magic } from './UTPMagicStrings.js';


/**
 * @interface
 * @name `UTPAPIINTERFACE`
 * @description crea una interface comun a la hora de querer reemplazar el objeto `UTPConection`
 */
interface UTPAPIINTERFACE{
    /*
    * aca se guardara la cookie PHPSESSID que es la unica cookie que se necesita para
    * iniciar sesion y mantenerla
    */
    cookieId:string;

    /*
    * aca se guardara el id que tendra el input del form que da la utp
    */
    formId:string;

    /*
    * guarda el usuario actual que usa la informacion
    */
    curentUser:string;

    /*
    * indica si se hizo la coneccion a utp.php
    */
    utpPHP:boolean;

    /**
     * @name validateUser
     * @description Verifica el usuario y contraseña y crea la instancia del PHPSESSID y del input ID
     * para el usuario
     */
    navigateIntoUtpPHP():Promise<boolean>;

    /**
     * @name validateUser
     * @param {string} usuario usuario registrado en la base de datos de la UTP
     * @param {string} contraseña contraseña de ese usuario de la base de datos de la utp
     * @description Verifica el usuario y contraseña y crea la instancia del PHPSESSID y del input ID
     * para el usuario
     */
    validateUser(usuario:string, contraseña:string):Promise<boolean>;

    /**
     * @name getUtpInfo
     * @description Obtiene el cookieId y el formId directamente de la pagina https://app4.utp.edu.co/pe/
     */
    getUtpInfo():Promise<UTPInfoInput>;

    /**
     * @name endSessionUser
     * @description Termina con la session del usuario
     */
    endSessionUser():void;
}

/**
 * @name `UTPConection`
 * @class
 * @description este objeto se encarga de crear una conecciion directa a la pagina de la UTP
 * con todos sus pasos para poder obtener cualquier dato
 */
class UTPConection implements UTPAPIINTERFACE{
    cookieId: string;
    formId: string;
    curentUser: string;
    utpPHP: boolean;
    /**
     * @constructor
     * @description simplemente inicialisa los parametors internos del objeto
     * @returns {void}
     */
    constructor(){
        this.cookieId = magic.void;
        this.formId = magic.void;
        this.curentUser = magic.void;
        this.utpPHP = false;
    }
    async navigateIntoUtpPHP(): Promise<boolean> {
        if(this.curentUser == magic.void){
            throw new missingError("No se ha encontrado un usuario");
        }
        if(this.cookieId == magic.void){
            throw new missingError("No se ha encontrado un PHPSESSID");
        }
        let limitTime = setTimeout(()=>{
            throw new conectionError("tiempo limite excedido");
        }, 10000);
        return fetch("https://app4.utp.edu.co/pe/utp.php", {
            "headers": {
                "cookie": this.cookieId
            },
            "body": null,
            "method": "GET"
        }).then(r=>{
            clearTimeout(limitTime);
            return r.text();
        }).then(text=>{
            this.utpPHP = text.substring(0, 8) !== magic.badUtpPhpRequest;
            return this.utpPHP;
        });
    }

    async validateUser(usuario, contraseña):Promise<boolean>{
        if(this.curentUser != magic.void){
            throw new userError("No puedes validar un usuario sin terminar la session de otro");
        }
        if(this.cookieId == magic.void || this.formId == magic.void){
            await this.getUtpInfo();
        }
        let data:string = `${this.formId}&txtUrio=${usuario}&txtPsswd=${contraseña}&cocat=0}`
        let limitTime = setTimeout(()=>{
            throw new conectionError("tiempo limite excedido");
        }, 60000);
        return fetch('https://app4.utp.edu.co/pe/validacion.php', {
            method: 'POST',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                'Cookie': this.cookieId
            },
            body: data
        }).then(result=>{
            clearTimeout(limitTime);
            if (!result.ok) {
                this.endSessionUser()
                throw new conectionError("error al conectarse con la pagina de la utp");
            }
            return result.json();
        }).then(json=>{
            let comprovacion:boolean = json[0] == magic.goodValidateUserRequest;
            if(!comprovacion){
                this.endSessionUser();
                throw new userError("las credenciales del usuario no son correctas");
            }
            this.curentUser = usuario;
            return comprovacion;
        })
    }

    /*async validateUser(usuario: string, contraseña: string): Promise<boolean> {
        if(this.curentUser != magic.void){
            throw new userError("No puedes validar un usuario sin terminar la session de otro");
        }
        if(this.cookieId == magic.void || this.formId == magic.void){
            await this.getUtpInfo();
        }
        let data = `${this.formId}&txtUrio=${usuario}&txtPsswd=${contraseña}&cocat=0}`
        let limitTime = setTimeout(()=>{
            throw new conectionError("tiempo limite excedido");
        }, 10000);
        return fetch('https://app4.utp.edu.co/pe/validacion.php', {
            method: 'POST',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                'Cookie': this.cookieId
            },
            body: data
        }).then(result=>{
            clearTimeout(limitTime);
            if (!result.ok) {
                this.endSessionUser()
                throw new conectionError("error al conectarse con la pagina de la utp");
            }
            return result.json();
        }).then(json=>{
            let comprovacion:boolean = json[0] == "RD";
            if(!comprovacion){
                this.endSessionUser();
                throw new userError("las credenciales del usuario no son correctas");
            }
            this.curentUser = usuario;
            return comprovacion;
        })
    }*/
    async getUtpInfo(): Promise<UTPInfoInput> {
        let limitTime = setTimeout(()=>{
            throw new conectionError("tiempo limite excedido");
        }, 10000);
        return fetch('https://app4.utp.edu.co/pe/', {
            method: 'GET',
        }).then(result=>{
            clearTimeout(limitTime)
            if (!result.ok) {
                throw new conectionError(`error http: ${result.status}`);
            }
            this.cookieId = result.headers.get("set-cookie").split(";")[magic.cookiePos].substring(magic.cookieLowBounds, magic.cookieHighBounds);
            return result.text()
        }).then(text=>{
                let html = parse(text);
                let input = html.querySelector(magic.UTPgetInput);
                let {name, value} = input.attributes;
                this.formId = `${name}=${value}`
                return{
                    PHPSESSID:this.cookieId,
                    INPUTATTR:this.formId
                };
        });
    }
    endSessionUser(): void {
        this.cookieId = magic.void;
        this.curentUser = magic.void;
        this.formId = magic.void;
        this.utpPHP = false;
        return;
    }
}

export {UTPConection, UTPAPIINTERFACE};