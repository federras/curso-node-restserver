const { request, response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async ( req = request, res = response ) => {

    const { id_token } = req.body;
    console.log( id_token );

    try {

        //Se loguea con su cuenta de google, si da error salta al catch
        const { correo, img, nombre} = await googleVerify( id_token );

        //Verificar si ya esta en BD, sino lo creo
        let usuario = await Usuario.findOne({ correo });
        // console.log(usuario);

        if (!usuario) {
            // Si el usuario no existe, tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'xD',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Verificar q el mail sea de un usuario activo
        if (!usuario.estado) {
            return res.status(401).json({
                mge: "Hable con administrador, usuario bloqueado"
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );      
    
        res.json({
            mge:"Google Sign In - ok",
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            mge: " No se pudo verificar Google JWT "
        })
    }
    
}

module.exports = {
    getAuth,
    login,
    googleSignIn
}