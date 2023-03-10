const { request, response } = require("express");

const esAdminRole = ( req = request, res = response, next ) => {

    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            mge: "se tiene que validar el JWT primero antes del rol"
        })
    }

    if (req.usuarioAutenticado.rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            mge: "No tiene privilegios, se necesita ser administrador"
        })
    }

    next();
}

const tieneRole = ( ...roles ) => {
    return (req = request, res = response, next) => {
        
        if (!req.usuarioAutenticado) {
            return res.status(500).json({
                mge: "se tiene que validar el JWT primero antes del rol"
            })
        }

        const { rol, nombre } = req.usuarioAutenticado;
        
        if (!roles.includes(rol)) {
            return res.status(401).json({
                mge: `El usuario ${ nombre } no dispone de alguno de los siguientes roles: ${ roles }`
            })
        }

        next();

    }

}

module.exports = {
    esAdminRole,
    tieneRole
}