const { apiError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors?.[0]?.message || 'Error de validación';
    return apiError(res, message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return apiError(res, 'Token inválido', 401);
  }

  const status = err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message || 'Error interno del servidor';

  return apiError(res, message, status);
};

module.exports = { errorHandler };
