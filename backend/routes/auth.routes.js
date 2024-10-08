const express = require('express');
const {check} = require('express-validator');

const {login, tokenLogin, logout, getResetTokenWithPass, getResetMail, verifyResetToken, resetPass} = require('../controllers/auth.controllers')
const {validationCheck} = require('../middleware/check-validation');
const {protectRoute} = require('../middleware/check-auth');

const router = express.Router();

router.post('/login', validationCheck([
    check('email').trim().notEmpty().isEmail(),
    check('password').notEmpty(),
]), login);

// router.get('/uniqueSignup', uniqueSignup)

router.post('/reset-mail', validationCheck([
    check('email').trim().isEmail()
]), getResetMail)

router.get('/verify-reset-token', validationCheck([
    check('token').notEmpty(),
]), verifyResetToken)

router.post('/reset-password', validationCheck([
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check('token').notEmpty()
]), resetPass)

router.use(protectRoute(true))

router.get('/tokenLogin', tokenLogin);

router.get('/logout', logout)

module.exports = router;