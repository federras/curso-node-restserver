const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');

// const { getUsuario, router } = require('../routes/usuarios');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categoria:  '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios',
        }

        
        // Conectar a DB
        this.conectarDB();

        // Middlewares (funcion que se ejecuta siempre que levantemos nuestro servidor)
        this.middlewares();
        
        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConection();
    };

    middlewares() {

        // CORS
        this.app.use( cors() );
        
        // Lectura y Parseo del Body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use( express.static('public'));

        // Fileupload - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categoria, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log( "Servidor corriendo en el puerto " + this.port );
        } );
    }
   

}

module.exports = Server;