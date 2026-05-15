const { body } = require('express-validator');

const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const validateUpdateStatus = [
  body('status')
    .isIn(VALID_STATUSES)
    .withMessage(`status debe ser uno de: ${VALID_STATUSES.join(', ')}`),
];

module.exports = { validateUpdateStatus };
