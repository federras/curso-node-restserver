const Role = require('../models/role');
const Usuario = require('../models/usuario')


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

module.exports = {
    esRolValido,
    emailExiste,
    idExiste
}