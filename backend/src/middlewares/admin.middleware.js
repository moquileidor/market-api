const { apiError } = require('../utils/apiResponse');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return apiError(res, 'Acceso denegado', 403);
  }
  next();
};

module.exports = { requireAdmin };
