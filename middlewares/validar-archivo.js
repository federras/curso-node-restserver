const { response } = require("express");

const validarArchivoSubir = (req, res = response, next) => {

     // Verificar que venga algun archivo en la request
     if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            mge: "No hay archivo para cargar"
        });
    }

    next();

}

module.exports = {
    validarArchivoSubir
}