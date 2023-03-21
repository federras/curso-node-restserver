const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2; 
cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const { options } = require('../routes/auth');
const { join } = require('path');

const cargarArchivo = async(req, res = response) => {
     
    try {
        const { archivo } = req.files;

        const nombreTemporal = await subirArchivo(archivo, undefined, 'imgs');
        res.json({
            nombreTemporal
        })
       
    } catch (error) {
        return res.json({
            error
        })
    }
}

// Ejemplo guardando las imagenes en el server local (no vamos a hacerlo así)
const actualizarImagen = async( req = request, res = response) => {
    
    const { coleccion, id } = req.params;

    let model;
    
    switch (coleccion) {
        case 'usuarios':
            model = await Usuario.findOne({_id: id, estado: true});
            if (!model) {
                return res.status(400).json({error: "Usuario inexistente o con estado false en la Base de Datos"})
            }
            break;

        case 'productos':
            model = await Producto.findById( id );
            if (!model) {
                return res.status(400).json({error: "Producto inexistente en la Base de Datos"})
            }
            break;
    
        default:
            res.status(500).json({
                error: "Se me olvidó esta colección, hablar desarrollador"
            })
            break;
    }
    
    try {

        // Borrar imagen vieja del server, si existe
        if (model.img) {

            const pathImagen = path.join( __dirname, '../uploads/', coleccion, model.img )
            // Ver si existe la imagen en el server
            const existeArchivo = fs.existsSync( pathImagen );
            // Si existe la imagen, borrarla
            if (existeArchivo) {
                fs.unlinkSync( pathImagen );
            }
        }

        // Cargar imagen nueva

        const nombreArchivo = await subirArchivo( req.files.archivo, undefined, coleccion);
        model.img = nombreArchivo;
        await model.save();

        res.json({
            coleccion,
            id,
            nombreArchivo
        })
        
    } catch (error) {
        res.status(400).json(error)
    }
}


// Ejemplo usando Cloudinary
const actualizarImagenCloudinary = async( req = request, res = response) => {
    
    const { coleccion, id } = req.params;
    
    let model;
    
    switch (coleccion) {
        case 'usuarios':
            model = await Usuario.findOne({_id: id, estado: true});
            if (!model) {
                return res.status(400).json({error: "Usuario inexistente o con estado false en la Base de Datos"})
            }
            break;
            
        case 'productos':
            model = await Producto.findById( id );
            if (!model) {
                return res.status(400).json({error: "Producto inexistente en la Base de Datos"})
            }
            break;
            
        default:
            res.status(500).json({
                error: "Se me olvidó esta colección, hablar desarrollador"
            })
            break;
        }
                
    try {
        
        // Borrar imagen vieja del cloudinary
        if (model.img) {
            // Reconstruimos el public_id de la imagen a borrar
            const urlCortada = model.img.split('/');
            const result = urlCortada[urlCortada.length - 1];
            const [ id ] = result.split('.');
            const public_id = join(coleccion, '/', id);
            // Borramos (si no existe, no pasa nada)
            cloudinary.uploader.destroy( public_id );
        }
        
        // Cargar imagen nueva
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder: coleccion} );
        
        // Guardar en el modelo
        model.img = secure_url;
        await model.save();
        
        res.json({
            model
        })
        
    } catch (error) {
        res.status(400).json(error)
    }
}
            

// Ejemplo manteniendo las imagenes en mismo server que el código. Esta función no la usaremos ya que
// ahora con cloudinary el url se almacena completo en img.
const mostrarImagen = async( req, res = response ) => {
    
    const { id, coleccion} = req.params;
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            //ver si es usuario valido
            model = await Usuario.findById( id );
            if ( !model ) {
                return res.status(400).json({ error: "Id de usuario inexistente"});
            }
            break;
        case 'productos':
            //ver si es usuario valido
            model = await Producto.findById( id );
            if ( !model ) {
                return res.status(400).json({ error: "Id de producto inexistente"});
            }
            break;
    
        default:
            res.status(500).json({
                error: "Se me olvidó esta colección, hablar desarrollador"
            })
            break;
    }
    
    try {
        
        // Verificamos si hay img en model en bd
        if (!model.img) {
            const pathNoImagen = path.join( __dirname, '../assets/no-image.jpg');
            return res.sendFile( pathNoImagen )
        }

        // Verificamos si el archivo existe en el servidor
        const pathFile = path.join(__dirname, '../uploads', coleccion, model.img)
        if ( !fs.existsSync(pathFile) ) {
            const pathNoImagen = path.join( __dirname, '../assets/no-image.jpg');
            return res.sendFile( pathNoImagen )
        }

        // Servimos img
        res.sendFile( pathFile );
        
    } catch (error) {
        res.json({ error })
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
}