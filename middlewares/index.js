const validaCampos = require('../middlewares/validar-campos');
const  validarRoles = require('../middlewares/validar-roles');
const validaJWT = require('../middlewares/validar-jwt');
const validarArchivo = require('./validar-archivo');

module.exports = {
    ...validaCampos,
    ...validarRoles,
    ...validaJWT,
    ...validarArchivo
}