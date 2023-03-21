const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo,
        actualizarImagen,
        mostrarImagen,
        mostrarImagenCloudinary,
        actualizarImagenCloudinary
    } = require('../controllers/uploads');
const { esColeccionValida } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'No es un mongo id valido').isMongoId(),
    check('coleccion').custom( (col) => esColeccionValida(col, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'No es un mongo id valido').isMongoId(),
    check('coleccion').custom( (col) => esColeccionValida(col, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagen )

module.exports = router;
