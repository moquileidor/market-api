const { Op } = require('sequelize');
const { Product, Category } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const productInclude = [{ model: Category, as: 'categories', through: { attributes: [] } }];

const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const { category, search } = req.query;

    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const include = [...productInclude];
    if (category) {
      include[0].where = {
        [Op.or]: [{ slug: category }, { id: Number.isNaN(Number(category)) ? -1 : Number(category) }],
      };
      include[0].required = true;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      distinct: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      items: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, isActive: true },
      include: productInclude,
    });

    if (!product) {
      return apiError(res, 'Producto no encontrado', 404);
    }

    return apiSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

const setCategories = async (product, categoryIds) => {
  if (categoryIds === undefined) return;
  const categories = await Category.findAll({ where: { id: categoryIds } });
  await product.setCategories(categories);
};

const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, imageUrl, categoryIds } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
    });

    await setCategories(product, categoryIds);

    const created = await Product.findByPk(product.id, { include: productInclude });
    return apiSuccess(res, created, 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return apiError(res, 'Producto no encontrado', 404);
    }

    const { name, description, price, stock, imageUrl, isActive, categoryIds } = req.body;

    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
    });

    await setCategories(product, categoryIds);

    const updated = await Product.findByPk(product.id, { include: productInclude });
    return apiSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return apiError(res, 'Producto no encontrado', 404);
    }

    await product.update({ isActive: false });
    return apiSuccess(res, { message: 'Producto desactivado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, getById, create, update, remove };
