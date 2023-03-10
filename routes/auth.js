const { Router } = require('express');
const { check } = require('express-validator');
const { getAuth, login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/login', getAuth);

router.post('/login', [
    check('correo', 'El correo debe ser un correo válido y es obligatorio').isEmail(),
    check('password', 'Debe ingresar una contraseña').not().isEmpty(),
    validarCampos
], login);

module.exports = router;