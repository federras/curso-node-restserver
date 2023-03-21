const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (archivo, extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif'], carpeta = '') => {

    return new Promise( (resolve, reject) => {

        // Averiguamos extensión del archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
        
        // Verificamos que la extensión sea válida dentro de las aceptadas
        const extensionEsValida = extensionesPermitidas.includes(extension);
        if (!extensionEsValida) {
            return reject("La extensión del archivo no es válida. Extensiones permitidas: " + extensionesPermitidas)
        }
        
        // Creamos el nombre del archivo único y el path donde guardarlo
        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemporal );
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject( err );
            }

            resolve( nombreTemporal )
        });
    })
}

module.exports = {
    subirArchivo
}