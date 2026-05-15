const { body, param } = require('express-validator');

const createRules = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug inválido'),
];

const idParamRules = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];

module.exports = { createRules, idParamRules };
