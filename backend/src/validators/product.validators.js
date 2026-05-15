const { body, param, query } = require('express-validator');

const listRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit inválido'),
  query('category').optional().isString(),
  query('search').optional().isString(),
];

const idParamRules = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];

const createRules = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('description').optional().isString(),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
  body('imageUrl').optional().isURL().withMessage('URL de imagen inválida'),
  body('categoryIds').optional().isArray().withMessage('categoryIds debe ser un arreglo'),
  body('categoryIds.*').optional().isInt({ min: 1 }).withMessage('categoryId inválido'),
];

const updateRules = [
  ...idParamRules,
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock inválido'),
  body('imageUrl').optional().isURL().withMessage('URL de imagen inválida'),
  body('isActive').optional().isBoolean().withMessage('isActive debe ser booleano'),
  body('categoryIds').optional().isArray().withMessage('categoryIds debe ser un arreglo'),
  body('categoryIds.*').optional().isInt({ min: 1 }).withMessage('categoryId inválido'),
];

module.exports = { listRules, idParamRules, createRules, updateRules };
