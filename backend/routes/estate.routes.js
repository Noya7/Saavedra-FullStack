const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');

const { createEstate, getEstates, deleteEstate, editEstate } = require('../controllers/estate.controllers');
const { validationCheck } = require('../middleware/check-validation');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();
const upload = multer()

router.get('/get-estates', validationCheck([
    check('query')
        .optional()
        .isString().withMessage('El parámetro de búsqueda debe ser una cadena de texto.')
        .isLength({ min: 4 }).withMessage('El parámetro de búsqueda debe tener al menos 4 caracteres.'),
    check('type')
        .optional()
        .isIn(['casa', 'departamento']).withMessage('El tipo debe ser "casa" o "departamento".'),
    check('rooms')
        .optional()
        .isIn([1, 2, 3, 4]).withMessage('El número de habitaciones debe ser 1, 2, 3 o 4.')
]), getEstates);

router.use(checkAuth)

router.post('/create-estate', upload.array('images'), validationCheck([
    check('title')
      .notEmpty().withMessage('El título es requerido.')
      .isString().withMessage('El título debe ser una cadena de texto.'),
    check('type')
      .notEmpty().withMessage('El tipo es requerido.')
      .isString().withMessage('El tipo debe ser una cadena de texto.'),
    check('rooms')
      .notEmpty().withMessage('El número de habitaciones es requerido.')
      .isInt({ min: 1 }).withMessage('El número de habitaciones debe ser un número entero positivo.'),
    check('location')
      .notEmpty().withMessage('La ubicación es requerida.')
      .isString().withMessage('La ubicación debe ser una cadena de texto.'),
    check('second_location')
      .optional()
      .isString().withMessage('La segunda ubicación debe ser una cadena de texto.'),
    check('price')
      .notEmpty().withMessage('El precio es requerido.')
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
    check('expenses')
      .optional()
      .isFloat({ min: 0 }).withMessage('Los gastos deben ser un número positivo.'),
    check('rented')
      .notEmpty().withMessage('El estado de alquiler es requerido.')
      .isBoolean().withMessage('El estado de alquiler debe ser un valor booleano.'),
    check('images')
      .isArray({ min: 1 }).withMessage('Las imágenes son requeridas y deben ser un array.')
      .custom((value) => value.every(img => typeof img === 'string')).withMessage('Cada imagen debe ser una cadena de texto.'),
    check('tags')
      .isArray({ min: 1 }).withMessage('Las etiquetas son requeridas y deben ser un array.')
      .custom((value) => value.every(tag => typeof tag === 'string')).withMessage('Cada etiqueta debe ser una cadena de texto.')
]), createEstate);

router.patch('/edit-estate', upload.array('images'), validationCheck([
    check('estateId').notEmpty().isMongoId(),
    check('title').optional().isString().withMessage('El título debe ser una cadena de texto.'),
    check('type').optional().isString().withMessage('El tipo debe ser una cadena de texto.'),
    check('rooms').optional().isInt({ min: 1 }).withMessage('El número de habitaciones debe ser un número entero positivo.'),
    check('location').optional().isString().withMessage('La ubicación debe ser una cadena de texto.'),
    check('second_location').optional().isString().withMessage('La segunda ubicación debe ser una cadena de texto.'),
    check('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
    check('expenses').optional().isFloat({ min: 0 }).withMessage('Los gastos deben ser un número positivo.'),
    check('rented').optional().isBoolean().withMessage('El estado de alquiler debe ser un valor booleano.'),
    check('tags').optional().isArray().withMessage('Las etiquetas deben ser un array.')
]), editEstate)

router.delete('/delete-estate', validationCheck([check('estateId').notEmpty().isMongoId()]), deleteEstate);

module.exports = router;