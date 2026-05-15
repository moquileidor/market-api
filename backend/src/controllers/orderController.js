const { Op } = require('sequelize');
const { sequelize, Order, OrderItem, Cart, CartItem, Product } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const orderInclude = [
  {
    model: OrderItem,
    as: 'items',
    include: [{ model: Product, as: 'product' }],
  },
];

const list = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: orderInclude,
      order: [['createdAt', 'DESC']],
    });
    return apiSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;

    const order = await Order.findOne({ where, include: orderInclude });
    if (!order) return apiError(res, 'Orden no encontrada', 404);

    return apiSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    if (!cart.items || cart.items.length === 0) {
      await t.rollback();
      return apiError(res, 'El carrito está vacío', 400);
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        await t.rollback();
        return apiError(res, `El producto "${item.product.name}" ya no está disponible`, 400);
      }
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return apiError(res, `Stock insuficiente para "${item.product.name}"`, 400);
      }
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await Order.create({ userId: req.user.id, total, status: 'pending' }, { transaction: t });

    await OrderItem.bulkCreate(
      cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      { transaction: t }
    );

    for (const item of cart.items) {
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.productId }, transaction: t }
      );
    }

    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();

    const created = await Order.findByPk(order.id, { include: orderInclude });
    return apiSuccess(res, created, 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return apiError(res, 'Orden no encontrada', 404);

    await order.update({ status: req.body.status });
    return apiSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const adminSummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where = { status: { [Op.ne]: 'cancelled' } };

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to) where.createdAt[Op.lte] = new Date(to);
    }

    const orders = await Order.findAll({ where });
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    return apiSuccess(res, {
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, getById, create, updateStatus, adminSummary };
