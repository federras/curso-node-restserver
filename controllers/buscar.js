const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesValidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
]

const buscarUsuario = async( termino = '', res = response ) => {

    // El termino de busqueda es Mongo id? 
    const esMongoId = isValidObjectId(termino);
    
    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );

        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    // El termino de busqueda es parte del nombre o del correo
    const regexp = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
      $or: [{nombre: regexp}, {correo: regexp}],
      $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategoria = async( termino, res ) => {

    // El termino es Mongo Id
    const esMongoId = isValidObjectId( termino );
    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    // El termino es parte del nombre
    const regexp = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({
        $and: [
            { nombre: regexp },
            { estado: true }
        ]
    });

    res.json({
        results: categorias
    })
}


const buscarProducto = async( termino, res ) => {

    // Si es mongo id
    const esMongoId = isValidObjectId( termino );
    if ( esMongoId ) {
        const producto = await Producto.findById( termino )
                                    .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [ producto ] : []
        })
    }

    // Si busca por nombre
    const regexp = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regexp, estado: true })
                                .populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesValidas.includes( coleccion ) ) {
        return res.status(400).json({
            mge: `Colección inválida. Debe ser una de las siguientes: ${coleccionesValidas}`
        })
    }

    switch( coleccion ) {
        case 'usuarios':
            buscarUsuario( termino, res );
            break;
        case 'categorias':
            buscarCategoria( termino, res );
            break;
        case 'productos':
            buscarProducto( termino, res );
            break;
        default:
            res.status(500).json({
                mge: "Hable con el administrador, no está programada la búsqueda de Roles"
            })
    }
}

module.exports = {
    buscar
}