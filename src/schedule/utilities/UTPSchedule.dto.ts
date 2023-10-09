/**
 * @name `ScheduleItem`
 * @interface
 * @description es una interface que data formato a laforma de recolectar cada fecha en el horario
 */
interface ScheduleItem{
    /**
     * @description aca se almacenara que dia de la semana ("Lunes", "Martes", "Miercoles", "Jueves",
     * "Viernes", "Sabado") que se dictara esa clase
     */
    dia:string;
    /**
     * @description dira en formato 24 horas el inicio de la clase se tiene entendido que
     * inicio < final
     */
    inicio:string;
    /**
     * @descripcion dira en formato 24 horas el final de la clase se tiene entendido que
     * inicio < final
     */
    final:string;
    /**
     * @description señalara en que salon se ubicara la clase en la UTP
     */
    salon:string;
}
/**
 * @name `ScheduleItem`
 * @interface
 * @description es una interface que data formato a laforma de recolectar cada fecha en el horario
 */
interface Schedule{
    /**
     * @description aca se guardara el codigo de la materia
     */
    codigo:string;
    /**
     * @description aca se guardara el numero del grupo
     */
    grupo:number;
    /**
     * @description aca se guardara el nombre de la materia
     */
    nombre:string;
    /**
     * @description aca se guardara todo lo relacionado a las fechas de clase
     */
    fechas:Array<ScheduleItem>;
}
export {Schedule, ScheduleItem}