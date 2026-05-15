const { validationResult } = require('express-validator');
const { apiError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return apiError(res, message, 400);
  }
  next();
};

module.exports = { validate };
