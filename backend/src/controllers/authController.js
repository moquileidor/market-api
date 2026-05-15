const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, Cart } = require('../models');
const { signToken } = require('../utils/jwt');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return apiError(res, 'El email ya está registrado', 400);
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'customer',
    });

    await Cart.create({ userId: user.id });

    const token = signToken({ id: user.id, role: user.role });
    const safeUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    return apiSuccess(res, { user: safeUser, accessToken: token }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return apiError(res, 'Credenciales inválidas', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return apiError(res, 'Credenciales inválidas', 401);
    }

    const token = signToken({ id: user.id, role: user.role });
    const safeUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    return apiSuccess(res, { user: safeUser, accessToken: token });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return apiSuccess(res, req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
