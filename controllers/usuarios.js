const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
 
usuariosGet = async (req = request, res = response) => {

    const { desde = 0, limite = 10 } = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find( query )
    //     .skip( desde )
    //     .limit( limite );

    // const total = await Usuario.countDocuments( query );

    // Mismo código anterior, más eficiente, al hacer que las dos promesas se procecen en paralelo
    const [ usuarios, total ] = await Promise.all([
        Usuario.find( query )
            .skip( Number(desde) )
            .limit( Number(limite) ),
        Usuario.countDocuments( query )
    ])

    res.json({
        total,
        usuarios
    });
}

usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { password, correo, google, _id, ...resto } = req.body;

    // Encriptar contraseña, falta contrastar con BD
    if ( password ) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } ); // con new: true, actualizamos la respuesta del json

    res.json({
        'msje': 'Put API - desde controller',
        id,
        resto,
        usuario
    })
}

usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    //Devolver response
    res.json({
        usuario
    })
}

usuariosPatch = (req, res = response) => {
    res.json({
        'msje': 'Patch API - desde controller'
    })
}

usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;
    // Borramos Físicamente el usuario (no lo haremos así)
        // const usuario = await Usuario.findByIdAndDelete( id )

    // Borramos Lógicamente, así es mejor
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    
    const usuarioAutenticado = req.usuarioAutenticado;

    res.json({
        'msje': 'Usuario Borrado - desde controller',
        usuario,
        usuarioAutenticado
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}