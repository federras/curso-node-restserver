const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, idExiste } = require('../helpers/db-validators');

const { validarCampos,
        validarJWT,
        tieneRole,
        esAdminRole
    } = require('../middlewares')

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( idExiste ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'Debe escribir un nombre').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('password', 'La password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id Mongo válido').isMongoId(),
    check('id').custom( idExiste ),
    validarCampos
], usuariosDelete);

module.exports = router;