const mongoose = require('mongoose');

const dbConection = async () => {

    try {
        mongoose.set('strictQuery', false);

        // await mongoose.createConnection(process.env.MONGODB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }).asPromise();

        // await mongoose.connect( process.env.MONGODB_CNN, {
        //     // useNewUrlParser: true,
        //     // useUnifiedTopology: true
        //     // useCreateIndex: true,
        //     // useFindAndModify: false
        // });

        await mongoose.connect( process.env.MONGODB_CNN);
        
        console.log('Base de datos online')


    } catch (error) {
        console.log(error);
        throw Error('Error al iniciar la Base de Datos')
    }


}

module.exports = {
    dbConection
}