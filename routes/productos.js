
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, getProductoPorId, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { categoriaExiste, productoPorIdExiste } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

// Crear producto - privado - cualquiera con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria ingresada para el producto no es un Mongo Id válido').isMongoId(),
    check('categoria').custom( categoriaExiste ),
    validarCampos
], crearProducto);

// Obtener producto por id - publico
router.get('/:id', [
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( productoPorIdExiste ),
    validarCampos
], getProductoPorId)


// Actualizar producto - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( productoPorIdExiste ),
    check('categoria', 'no es mongoid').optional().isMongoId(),
    check('categoria').optional().custom( categoriaExiste ),
    validarCampos
], actualizarProducto
)

// Borrar Producto - privado - Rol de admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un Mongo Id Válido').isMongoId(),
    check('id').custom( productoPorIdExiste ),
    esAdminRole,
    validarCampos
], borrarProducto
)



module.exports = router;

