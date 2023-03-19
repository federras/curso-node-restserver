const { request, response } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const categoriasGet = async(req = request, res = response) => {

    const { desde = 0, limite = 10 } = req.query;
    const query = { estado: true };

    // const categorias = await Categoria.find( query );
    // const total = await Categoria.countDocuments( query );

const [ categorias, total ] = await Promise.all([
    Categoria.find( query )
        .skip( Number(desde) )
        .limit( Number(limite) )
        .populate('usuario', 'nombre'),
    Categoria.countDocuments( query )
])

    res.json({
        mge: "Total de Categorías:",
        total,
        categorias,
    })
}

// obtenerCategoria - populate {}
const getCategoriaPorId = async (req = request, res = response) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findById( id )
        .populate('usuario', 'nombre')
    
    res.json(categoria)
}

const crearCategoria = async ( req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    // Verificar que la categoria a crear no exita
    const categoriaBD = await Categoria.findOne({ nombre });
    if ( categoriaBD ) {
        return res.status(400).json({
            mge: `La categoría ${ nombre } ya existe en la Base de Datos`
        })
    }

    //Crea la data de la categoria y la guarda eb DB
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = new Categoria( data );
    await categoria.save();

    res.status(201).json({
        mge: 'Categoría creada',
        categoria
    })
}

const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const  { estado, usuario, ...data  } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } )
    await categoria.save()

    res.json({
        mge: "Actualizado",
        categoria
    })
}

const borrarCategoria = async( req, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.status(200).json( categoriaBorrada );

}

module.exports = {
    categoriasGet,
    getCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}