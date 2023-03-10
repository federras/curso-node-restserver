const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligada sra']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        enum: ['ADMIN_ROLE','USER_ROLE', 'VENTAS_ROLE'],
        required: [true, 'Debe ingresar Rol valido']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//Sobreescribimos metodo por defecto para que devuelva el objeto con menos campos
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);