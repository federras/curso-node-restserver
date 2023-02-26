const { request, response } = require('express');

usuariosGet = (req = request, res = response) => {

    const { q, nombre, page = 1, size = 10 } = req.query;

    res.json({
        'msje': 'Get API - desde controller',
        q,
        nombre,
        page,
        size
    });
}

usuariosPut = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        'msje': 'Put API - desde controller',
        id
    })
}

usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        'msje': 'Post API - desde controller',
        nombre,
        edad
    })
}

usuariosPatch = (req, res = response) => {
    res.json({
        'msje': 'Patch API - desde controller'
    })
}

usuariosDelete = (req, res = response) => {
    res.json({
        'msje': 'Delete API - desde controller'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}