const { Schema, model } = require('mongoose');

const RolSchema = Schema({
    role: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
})

module.exports = model('Role', RolSchema);