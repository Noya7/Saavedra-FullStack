const HttpError = require('../models/Http-Error')
const {validationResult} = require('express-validator')

//***********SANITIZERS***********

//string sanitizer: takes a string, trims it and then uppercases the first letter of each word in it.

const uppercaseField = (string) => {
    const words = string.trim().split(' ');
    const uppercaseArray = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return uppercaseArray.join(' ')
}

//similar to the one above but only uppercases the first letter and lowercases everything else. Useful for long texts.

const uppercaseFirst = (string) => {
    const lowercaseStr = string.trim().toLowerCase();
    const resultStr = lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);
    return resultStr;
}

//tags sanitizer, creates an array with the tags provided:

const tagSanitizer = (string) => string.split(', ');

//***********VALIDATION***********

//error check

const validationErrorCheck = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            let validationErrors = [];
            errors.errors.forEach((err) => {
                let {path} = err;
                validationErrors.push(path);
            });
            throw new HttpError(
            "Datos invalidos, por favor, corrige tus entradas e intenta de nuevo. Errores en: "
            + validationErrors.join(", "), 400)
        }
        return next();
    } catch (err) {
        return next(err)
    }
}

//centralized validator middleware: takes a validation chain as parameter

const validationCheck = (validations) => { return [...validations, validationErrorCheck]};


module.exports = {validationCheck, uppercaseField, uppercaseFirst, tagSanitizer};