const { Category } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const toSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return apiSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, slug: slugInput } = req.body;
    const slug = slugInput || toSlug(name);

    const exists = await Category.findOne({ where: { slug } });
    if (exists) {
      return apiError(res, 'El slug ya existe', 400);
    }

    const category = await Category.create({ name, slug });
    return apiSuccess(res, category, 201);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return apiError(res, 'Categoría no encontrada', 404);
    }

    await category.destroy();
    return apiSuccess(res, { message: 'Categoría eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, remove };
