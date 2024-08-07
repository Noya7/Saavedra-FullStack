const {MongoServerError} = require('mongodb')
const HttpError = require('../models/Http-Error')

const errorHandler = (err, req, res, next) => {
    console.log("error detected")
    if(err instanceof HttpError){
        return res.status(err.code).json({error: err.message})
    }
    if(err instanceof MongoServerError){
        if (err.code && err.code === 11000) {
            return res.status(409).json({error: `Ya existe un usuario con estas credenciales. Por favor, inica sesion o modifica tus entradas. Datos duplicados: ${Object.keys(err.keyPattern)}`})
        }
        return res.status(500).json({error: "Ha ocurrido un error inesperado en la base de datos, y estamos trabajando para solucionarlo. Codigo de error: " + err.code, mongoErr: err.message})
    }
    console.log(err)
    return res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
}

module.exports = errorHandler;