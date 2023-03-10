const { request, response, json } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            mge: "No hay token en la petición"
        });
    };

    console.log(req.token);   
    
    try {

        // La siguiente funcion Verifica el jwt.
        // Si da error dispara un throw new Error, por eso lo capturamos en el catch
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioAutenticado = await Usuario.findById(uid);

        // Verificar que no sea undefine
        if (!usuarioAutenticado) {
            return res.status(401).json({
                mge: "ERROR TOKEN, no se encuentra usuario con ese id en la BD"
            })
        }

        // Verificar que el estado: true
        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                mge: "ERROR, Token no valido. Este usuario ya fue eliminado de la BD, estado: false"
            })
        }

        req.usuarioAutenticado = usuarioAutenticado;
        
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            mge: "Token No Valido"
        })
    }

}


module.exports = {validarJWT};