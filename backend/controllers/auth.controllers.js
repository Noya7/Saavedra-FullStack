const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mail = require('../mail/mail')

const Admin = require('../models/Admin')

//Ideally, this is used once and never again, so I'll leave this as a comment, in case you want to try the code, but
//its not a great idea to keep a signup route or controller for a private app that wont require it.

// const uniqueSignup = async (req, res, next) => {
//     let createdUser, mySecret, resetSecret;
//     try {
//         mySecret = await bcrypt.genSalt();
//         resetSecret = await bcrypt.genSalt();
//         const hashedPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
//         createdUser = new Admin({
//             email: process.env.ADMIN_EMAIL,
//             password: hashedPass,
//             name: process.env.ADMIN_NAME,
//             surname: process.env.ADMIN_SURNAME,
//             DNI: process.env.ADMIN_DNI,
//             phone: process.env.ADMIN_PHONE,
//             creationDate: new Date()
//         })
//         await createdUser.save();
//         return res.status(200).json(createdUser);
//     } catch (err) {
//         return next(err)
//     } finally {
//         console.log(createdUser, mySecret, resetSecret)
//     }
// }

const login = async (req, res, next) => {
    try {
        const existingUser = await Admin.findOne({email: req.body.email}, {password: 1, name: 1, email: 1, _id: 0});
        if (!existingUser) throw new HttpError("Usuario no encontrado o inexistente.", 404)
        //comparar contraseñas:
        const isRightPass = await bcrypt.compare(req.body.password, existingUser.password);
        if (!isRightPass) throw new HttpError("Credenciales incorrectas, por favor controla tus entradas o recupera tu contraseña si la olvidaste.", 401);
        const userData = existingUser.toObject()
        delete userData.password;
        //obtencion de token:
        const token = jwt.sign({userData}, process.env.MY_SECRET, { expiresIn: "4h" });
        //respuesta:
        res.cookie("token", token, {
            httpOnly: true, 
            maxAge: 14400000, 
            sameSite: 'none', 
            secure: true, 
        }).status(200).json({userData, message: "Sesion iniciada correctamente. Bienvenid@!"})
    } catch (err) {
        return next(err)
    }
};

const tokenLogin = async (req, res, next) => {
    try {
        if(!req.userData) throw new HttpError('Credenciales invalidas, caducadas o inexistentes. Por favor, loggeate de nuevo.', 400);
        const existingUser = await Admin.findById(req.userData.userId, {name: 1, email: 1, _id: 0});
        if (!existingUser) throw new HttpError("Usuario no encontrado o inexistente.", 404)
        return res.status(200).json({message: 'Sesion iniciada correctamente. Bienvenid@!'})
    } catch (err) {
        return next(err)
    }
};

const logout = (req, res, next) => {
    if (!req.userData) throw new HttpError('No hay una sesion activa para cerrar.', 400)
    return res.cookie('token', '', { httpOnly: true, maxAge: 0, sameSite: 'none', secure: true}).status(200).json({message: "Sesión finalizada correctamente."})
}

const getResetTokenWithPass = async (req, res, next) => {
    try {
        const {email, userId} = req.userData;
        const {password} = req.body;
        //get userData:
        const existingUser = await Admin.findById(userId).select('password');
        if (!existingUser) throw new HttpError('No existe ningun usuario registrado con este DNI en la base de datos. Por favor, chequea tus entradas.', 404);
        //compare pass:
        const isSamePass = await bcrypt.compare(password, existingUser.password);
        if (!isSamePass) throw new HttpError("Credenciales incorrectas, por favor controla tus entradas o recupera tu contraseña de otra forma.", 401);
        //generate reset token with different secret, and then generate reset url:
        const resetToken = jwt.sign(existingUser, process.env.RESET_SECRET, {expiresIn: '15m'})
        //return the reset token:
        return res.status(200).json({token: resetToken, message: 'Token creado exitosamente.'})
    } catch (err) {
        return next (err);
    }
};

const getResetMail = async (req, res, next) => {
    try {
        //get DNI from body and check if it belongs to an existing account:
        const {email} = req.body;
        const existingUser = await Admin.findOne({email}).select('email');
        if (!existingUser) throw new HttpError("No existe ningun usuario registrado con este DNI en la base de datos. Por favor, chequea tus entradas.", 404);
        //generate reset token with different secret, and then generate reset url:
        const resetToken = jwt.sign(existingUser, process.env.RESET_SECRET, {expiresIn: '15m'})
        const resetURL = `${process.env.FRONTEND_URL}/auth/reset?token=${resetToken}`
        //send mail with url
        mail.resetPass(existingUser.email, resetURL)
        //response:
        return res.status(200).json({message: 'Codigo de recuperacion enviado con exito a la cuenta de correo asociada. Si no encuentras el mensaje, verifica tu carpeta de correo no deseado.'})
    } catch (err) {
        return next(err)
    }
};

const verifyResetToken = async(req, res, next) => {
    try {
        const {token} = req.headers;
        const decoded = jwt.verify(token, process.env.RESET_SECRET, (err, decoded)=>{
          if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
          return decoded
        })
        return res.status(200).json(decoded)
    } catch (err) {
        return next(err)
    }
}

const resetPass = async (req, res, next) => {
    try {
        const {token} = req.headers;
        //verify token
        const decoded = jwt.verify(token, process.env.RESET_SECRET, (err, decoded)=>{
            if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
            return decoded
        })
        //get pass from db to compare it:
        const user = await Admin.findById(decoded.existingUser._id).select('password')
        //get new pass from body, compare and if its different, hash.
        const isOldPass = await bcrypt.compare(req.body.password, user.password);
        if (isOldPass) throw new HttpError('Para actualizar tu contraseña, debes elegir una distinta a la actual.', 400);
        //update user
        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save()
        //response
        return res.status(200).json({message: "Contraseña actualizada exitosamente! Podes proceder a iniciar sesion."})
    } catch (err) {
        return next(err)
    }
};

module.exports = {login, logout, tokenLogin, getResetTokenWithPass, getResetMail, verifyResetToken, resetPass}