const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
// const { getUsuario, router } = require('../routes/usuarios');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        
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
    }


    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log( "Servidor corriendo en el puerto " + this.port );
        } );
    }
   

}

module.exports = Server;