const express = require('express');
const cors = require('cors');
// const { getUsuario, router } = require('../routes/usuarios');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';
        
        //Middlewares (funcion que se ejecuta siempre que levantemos nuestro servidor)
        this.middlewares();
        
        //Rutas
        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y Parseo del Body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use( express.static('public'));
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log( "Servidor corriendo en el puerto " + this.port );
        } );
    }
   

}

module.exports = Server;
