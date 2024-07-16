const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
    try {
        if(!req.cookies.token) throw new HttpError("No estas autorizad@ para acceder a esta ruta.")
        const decodedToken = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
            return decoded
        });
        req.userData = {...decodedToken};
        return next();
    } catch (err) {
        if (err instanceof HttpError) return res.clearCookie("token", {httpOnly: true}).status(err.status).json({error: err.message});
        return next(err)
    }
}

module.exports = checkAuth;