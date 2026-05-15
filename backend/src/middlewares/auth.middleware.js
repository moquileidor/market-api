const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');
const { apiError } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return apiError(res, 'Token requerido', 401);
    }

    const token = header.slice(7);
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return apiError(res, 'Usuario no encontrado', 401);
    }

    req.user = user;
    next();
  } catch {
    return apiError(res, 'Token inválido o expirado', 401);
  }
};

module.exports = { authenticate };
