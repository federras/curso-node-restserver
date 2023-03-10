const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');

const getAuth = (req = request, res = response) => {

    res.json({
        msje: 'getAuth controller OK'
    })
}

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    // Verificar si el mail existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        return res.status(400).json({
            mge: "Usuario inexistente"
        });
    }
    
    // Verificar que el mail sea de un usuario activo
    if (!usuario.estado) {
        return res.status(400).json({
            mge: "Usuario dado de baja"
        });
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync( String(password), String(usuario.password) );
    if (!validPassword) {
        return res.status(400).json({
            mge: "Contraseña incorrecta"
        });
    }

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    try {
        res.json({
            mge: "login controller OK",
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            mge: 'Hable con el administrador, hay un error'
        });
    }

};

module.exports = {
    getAuth,
    login
}