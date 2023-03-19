const { request, response } = require('express');
const { Producto } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerProductos = async(req = request, res = response) => {

    const { desde = 0, limite = 10 } = req.query;
    const query = { estado: true };

    const [ productos, total ] = await Promise.all([
        Producto.find( query )
            .skip( Number(desde) )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
            .populate('categoria', 'usuario'),
        Producto.countDocuments( query )
    ])

    res.json({
        total,
        productos,
    })
}

const crearProducto = async(req, res=response) => {

    const { estado, disponible, usuario, ...body } = req.body;

    body.nombre = body.nombre.toUpperCase();
 
     // Verificar que el producto no exista en la DB
    const productoBD = await Producto.findOne({ nombre: body.nombre });
    if ( productoBD ) {
        return res.status(400).json({
            mge: `El producto ${body.nombre} ya existe en la Base de Datos`
        })
    }

    //Crea la data del producto y la guarda eb DB
    const data = {
        ...body,
        usuario: req.usuarioAutenticado._id,
    }

    const producto = new Producto( data );
    await producto.save();

    res.status(201).json({
        mge: 'Producto creado',
        producto
    })
}

// obtenerProducto por id - populate {}
const getProductoPorId = async (req = request, res = response) => {
    
    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    
    res.json(producto)
}

const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { usuario, estado, _id, ...body } = req.body;
    if (body.nombre) {
        body.nombre = body.nombre.toUpperCase();
    }

    const producto = await Producto.findByIdAndUpdate( id, body, { new: true } );
    await producto.save();

    res.json(producto)
}

const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );
    await productoBorrado.save();

    res.json(productoBorrado)
}

module.exports = {
    obtenerProductos,
    crearProducto,
    getProductoPorId,
    actualizarProducto,
    borrarProducto
}