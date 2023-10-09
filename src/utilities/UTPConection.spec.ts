import { UTPConection } from "./UTPconection.js";
import { UTPInfoInput } from "./UTP.dto.js";
import dotenv from 'dotenv'

dotenv.config();

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;

const COOKIE_VALUE_EXAMPLE:string = "PHPSESSID=71bvcup2lr1qvmpkln35ccdju5";
const INPUT_VALUE_EXAMPLE:string = "10f6e80e20776a736ef9637cad75890e:3b319c15d0b164a11497e47e669bbb10a8a45f3576cc873065ba627142f7dfe1";

describe("UTPConection clase", ()=>{
    test("UTPConection debe ser un objecto", ()=>{
        const API = new UTPConection();
        expect(API).toBeInstanceOf(Object);
    });
})

describe("UTPConection getUtpInfo funcion", ()=>{
    test("getUtpInfo debe devolver un PHPSESSID valido", async ()=>{
        const API = new UTPConection();
        let info:UTPInfoInput = await API.getUtpInfo();
        expect(info["PHPSESSID"]).toBeDefined();
        expect(info["PHPSESSID"].length).toEqual(COOKIE_VALUE_EXAMPLE.length);
    })
    test("getUtpInfo debe guardar la informacion de PHPSESSID en cookieId", async ()=>{
        const API = new UTPConection();
        let info:UTPInfoInput = await API.getUtpInfo();
        expect(info["PHPSESSID"]).toEqual(API.cookieId);
    });
    test("getUtpInfo debe devolver un INPUTATTR valido", async ()=>{
        const API = new UTPConection();
        let info:UTPInfoInput = await API.getUtpInfo();
        expect(info["INPUTATTR"]).toBeDefined();
        expect(info["INPUTATTR"].length).toEqual(INPUT_VALUE_EXAMPLE.length);
    })
    test("getUtpInfo debe guardar la informacion de INPUTATTR en cookieId", async ()=>{
        const API = new UTPConection();
        let info:UTPInfoInput = await  API.getUtpInfo();
        expect(info["INPUTATTR"]).toEqual(API.formId);
    });
    test("getUtpInfo no debe devolver valores constantes", async ()=>{
        const API = new UTPConection();
        let info:UTPInfoInput = await  API.getUtpInfo();
        expect(await API.getUtpInfo()).not.toEqual(info);
    });
})

describe("UTPConection validateUser funcion", ()=>{
    test("validateUser debe fallar con un userError si se tiene un usuario ya validado", async ()=>{
        const API = new UTPConection();
        API.curentUser = "1";
        try {
            await API.validateUser("1004695959", "pepitoperes");
        } catch (e) {
            expect(e.name).toMatch("user Error");
        }
    });
    test("validateUser debe asignar una cookie valida y un formId valido si no se tienen ya", async ()=>{
        const API = new UTPConection();
        try{
            await API.validateUser("1004685950", "pepitoperes");
        }catch(e){
            return;
        }
        expect(API.cookieId.length).toEqual(COOKIE_VALUE_EXAMPLE.length)
        expect(API.formId.length).toEqual(INPUT_VALUE_EXAMPLE.length)
    });
    test("validateUser debe fallar con un userError si las credenciales del usuario son incorrectas", async ()=>{
        const API = new UTPConection();
        try {
            await API.validateUser("1004695959", "pepitoperes");
        } catch (e) {
            expect(e.name).toMatch("user Error")
        }
    });
    test("validateUser debe validar un usuario correcto", async ()=>{
        const API = new UTPConection();
        await API.validateUser(USER, PASSWORD);
        expect(API.curentUser).toEqual("1004685950")
    }, 60000);
})

describe("UTPConection navigateIntoUtpPHP funcion", ()=>{
    test("navigateIntoUtpPHP debe fallar con un missing Error si no hay un usuario", async ()=>{
        const API = new UTPConection();
        try {
            await API.navigateIntoUtpPHP();
        } catch (e) {
            expect(e.name).toMatch("missing Error");
        }
    });
    test("navigateIntoUtpPHP debe fallar con un missing Error si no se tiene una cookieId", async ()=>{
        const API = new UTPConection();
        API.curentUser = "1";
        try {
            await API.navigateIntoUtpPHP();
        } catch (e) {
            expect(e.name).toMatch("missing Error");
        }
    });
    test("navigateIntoUtpPHP debe volver un falso a utpPHP con malas credenciales", async ()=>{
        const API = new UTPConection();
        API.curentUser = "1";
        API.cookieId = COOKIE_VALUE_EXAMPLE;
        await API.navigateIntoUtpPHP();
        let utpPHP:boolean = API.utpPHP;
        expect(utpPHP).toBe(false);
    });
});

describe("UTPConection endSessionUser funcion", ()=>{
    test("endSessionUser debe eliminar el PHPSESSID", async ()=>{
        const API = new UTPConection();
        try{
            await API.getUtpInfo();
        }catch(e){
            return
        }
        API.endSessionUser();
        expect(API.cookieId).toEqual("");
    });
    test("endSessionUser debe eliminar el formid", async ()=>{
        const API = new UTPConection();
        try{
            await API.getUtpInfo();
        }catch(e){
            return
        }
        API.endSessionUser();
        expect(API.formId).toEqual("");
    });
    test("endSessionUser debe eliminar el usuario actual", async ()=>{
        const API = new UTPConection();
        try{
            await API.getUtpInfo();
        }catch(e){
            return
        }
        API.endSessionUser();
        expect(API.curentUser).toEqual("");
    });
    test("endSessionUser debe volver falso el utpPHP", async ()=>{
        const API = new UTPConection();
        try{
            await API.getUtpInfo();
        }catch(e){
            return
        }
        API.endSessionUser();
        expect(API.utpPHP).toEqual(false);
    });
})