
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { categoriasGet,
    getCategoriaPorId,
    crearCategoria,
    actualizarCategoria, 
    borrarCategoria} = require('../controllers/categorias');
const { categoriaExiste } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', categoriasGet);

// Obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( categoriaExiste ),
    validarCampos
], getCategoriaPorId)

// Crear categoria - privado - cualquiera con token valuido
router.post('/', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
crearCategoria
)

// Actualizar categoria - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( categoriaExiste ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria
)

// Borrar Categoría - privado - Rol de admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( categoriaExiste ),
    esAdminRole,
    validarCampos
], borrarCategoria
)

module.exports = router;

