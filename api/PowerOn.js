/**
 *  `POWER_ON`
 *  Посылается при первом соединении после питания контроллера и продолжает посылаться до тех
 *  пор, пока сервер не пришлет SET_ACTIVE
 */
const PowerOn = (
    {
        id,
        operation,
        fw,
        conn_fw,
        active,
        mode,
        controller_ip
    }
) => {
return {
    "id": id,
    "operation": operation,
    "fw": fw,
    "conn_fw": conn_fw,
    "active": active,
    "mode": mode,
    "controller_ip": controller_ip

}
}

