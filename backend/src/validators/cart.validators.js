const { body } = require('express-validator');

const validateAddCartItem = [
  body('productId').isInt({ min: 1 }).withMessage('productId debe ser un entero positivo'),
  body('quantity').isInt({ min: 1 }).withMessage('quantity debe ser al menos 1'),
];

const validateUpdateCartItem = [
  body('quantity').isInt({ min: 1 }).withMessage('quantity debe ser al menos 1'),
];

module.exports = { validateAddCartItem, validateUpdateCartItem };
