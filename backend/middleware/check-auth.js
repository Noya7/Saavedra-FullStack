const jwt = require('jsonwebtoken');
const HttpError = require('../models/Http-Error');

const checkAuth = (req, res, next) => {
    try {
        if(!req.cookies.token) return next();
        const decodedToken = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
            return decoded
        });
        req.userData = {...decodedToken};
        return next();
    } catch (err) {
        if (err instanceof HttpError) return res.clearCookie("token", {httpOnly: true}).status(err.code).json({error: err.message});
        return next(err)
    }
}

const protectRoute = (routeProtection) => (req, res, next) => {
    try {
        if(routeProtection){
            if(!req.userData){
                throw new HttpError(
                    "No estas autorizado/a para acceder a esta ruta. Por favor, inicia sesion e intenta de nuevo.", 401)
            }
            return next()
        }
        if(req.userData){
            throw new HttpError("No puedes realizar esta accion porque ya iniciaste sesion.", 401)
        }
        return next()
    } catch (err) {return next(err)}
}

module.exports = {checkAuth, protectRoute};