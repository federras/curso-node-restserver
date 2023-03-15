const { Router } = require('express');
const { check } = require('express-validator');
const { getAuth, login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/login', getAuth);

router.post('/login', [
    check('correo', 'El correo debe ser un correo válido y es obligatorio').isEmail(),
    check('password', 'Debe ingresar una contraseña').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'Debe loguearse con google para obtener id token').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;