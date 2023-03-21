const { check } = require('express-validator');
const { Categoria, Usuario, Role, Producto } = require('../models');
// const Role = require('../models/role');
// const Usuario = require('../models/usuario')


const esRolValido = async ( role = '') => {
    const rolExiste = await Role.findOne( {role} );
    if ( !rolExiste ) {
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }

}

// Verificar si correo existe
const emailExiste = async ( correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El mail ${ correo } ya existe en la BD`);
    };
}

// Verificar si id existe en BD
const idExiste = async ( id = '') => {
    const existeId = await Usuario.findById( id );
    if ( !existeId ) {
        throw new Error('El id ingresado no existe');
    }
}

const categoriaExiste = async ( id = '' ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error('El id de categoria ingresado no existe en la base de datos')
    }
}

const productoPorIdExiste = async ( id = '' ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error('El id del producto ingresado no existe en la base de datos')
    }
}

const esColeccionValida = ( coleccion = '', colecciones = []) => {
    const esValida = colecciones.includes(coleccion);
    if (!esValida) {
        throw new Error (`La colección ${coleccion} no es válida, debe ser una de las siguientes: ${colecciones}`)
    }
    return true;
}


module.exports = {
    esRolValido,   
    emailExiste,
    idExiste,
    categoriaExiste,
    productoPorIdExiste,
    esColeccionValida
}