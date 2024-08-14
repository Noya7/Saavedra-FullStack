const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');

const { createEstate, getEstates, deleteEstate, editEstate, getEstateById, getLocationById } = require('../controllers/estate.controllers');
const { validationCheck, tagSanitizer } = require('../middleware/check-validation');
const {protectRoute} = require('../middleware/check-auth')

const router = express.Router();
const upload = multer()

router.get('/get-estates', validationCheck([
    check('query')
        .optional()
        .isString().withMessage('El parámetro de búsqueda debe ser una cadena de texto.')
        .isLength({ min: 4 }).withMessage('El parámetro de búsqueda debe tener al menos 4 caracteres.'),
    check('type')
        .optional()
        .isIn(['house', 'apartament']).withMessage('El tipo debe ser "casa" o "departamento".'),
    check('rooms')
        .optional()
        .isIn([1, 2, 3, 4]).withMessage('El número de habitaciones debe ser 1, 2, 3 o 4.')
]), getEstates);

router.get('/get-location', validationCheck([check('estateId').notEmpty().isMongoId()]), getLocationById)

router.use(protectRoute(true));

router.post('/create-estate', upload.array('images'), validationCheck([
    check('title')
      .notEmpty().withMessage('El título es requerido.')
      .isString().withMessage('El título debe ser una cadena de texto.'),
    check('type')
      .notEmpty().withMessage('El tipo es requerido.')
      .isString().withMessage('El tipo debe ser una cadena de texto.')
      .isIn(['house', 'apartament']),
    check('rooms')
      .notEmpty().withMessage('El número de habitaciones es requerido.')
      .isInt({ min: 1, max: 4 }).withMessage('El número de habitaciones debe ser un número entero positivo.'),
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
    check('tags')
      .customSanitizer(tagSanitizer)
      .isArray({ min: 1 }).withMessage('Las etiquetas son requeridas y deben ser un array.')
      .custom((value) => value.every(tag => typeof tag === 'string')).withMessage('Cada etiqueta debe ser una cadena de texto.')
    ]), createEstate);

router.get('/get-estate', validationCheck([check('estateId').notEmpty().isMongoId()]), getEstateById);

router.patch('/edit-estate', upload.array('images'), validationCheck([
    check('estateId').notEmpty().isMongoId(),
    check('deletedImages').optional().customSanitizer(tagSanitizer).isArray({min: 1}),
    check('title').optional().isString().withMessage('El título debe ser una cadena de texto.'),
    check('type')
      .optional()
      .notEmpty().withMessage('El tipo es requerido.')
      .isString().withMessage('El tipo debe ser una cadena de texto.')
      .isIn(['house', 'apartament']),
    check('rooms').optional().isInt({ min: 1 }).withMessage('El número de habitaciones debe ser un número entero positivo.'),
    check('location').optional().isString().withMessage('La ubicación debe ser una cadena de texto.'),
    check('second_location').optional().isString().withMessage('La segunda ubicación debe ser una cadena de texto.'),
    check('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
    check('expenses').optional().isFloat({ min: 0 }).withMessage('Los gastos deben ser un número positivo.'),
    check('rented').optional().isBoolean().withMessage('El estado de alquiler debe ser un valor booleano.'),
    check('tags')
      .customSanitizer(tagSanitizer)
      .isArray({ min: 1 }).withMessage('Las etiquetas son requeridas y deben ser un array.')
      .custom((value) => value.every(tag => typeof tag === 'string')).withMessage('Cada etiqueta debe ser una cadena de texto.')
    ]), editEstate);

router.delete('/delete-estate', validationCheck([check('estateId').notEmpty().isMongoId()]), deleteEstate);

module.exports = router;