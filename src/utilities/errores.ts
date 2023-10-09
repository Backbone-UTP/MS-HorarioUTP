//``


/**
 * @description Una clase que se encarga de manejar los errores del usuario
 * @extends {Error}
 * @example new userError("") imprime user Error
 */
export class userError extends Error{
    constructor(message:string){
        super(message);
        this.name = "user Error"
    }
}

/**
 * @description Una clase que se encarga de manejar los errores sobre el manejo de cookies
 * @extends {Error}
 * @example new cookieError("") imprime cookie Error
 */
export class cookieError extends Error{
    constructor(message:string){
        super(message);
        this.name = "cookie Error"
    }
}

/**
 * @description Una clase que se encarga de manejar los errores sobre el manejo de errores de coneccion
 * @extends {Error}
 * @example new conectionError("") imprime conection Error
 */
export class conectionError extends Error{
    constructor(message:string){
        super(message);
        this.name = "conection Error"
    }
}

/**
 * @description Una clase que se encarga de manejar los errores cuando un valor clave falta
 * @extends {Error}
 * @example new missingError("") imprime missing Error
 */
export class missingError extends Error{
    constructor(message:string){
        super(message);
        this.name = "missing Error"
    }
}
