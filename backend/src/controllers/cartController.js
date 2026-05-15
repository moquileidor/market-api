const { Cart, CartItem, Product } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const cartInclude = [
  {
    model: CartItem,
    as: 'items',
    include: [{ model: Product, as: 'product' }],
  },
];

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: cartInclude,
    });
    return apiSuccess(res, cart);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) return apiError(res, 'Producto no encontrado', 404);
    if (product.stock < quantity) return apiError(res, 'Stock insuficiente', 400);

    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    const [item, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { quantity },
    });

    if (!created) {
      const newQty = item.quantity + quantity;
      if (product.stock < newQty) return apiError(res, 'Stock insuficiente', 400);
      await item.update({ quantity: newQty });
    }

    const updated = await Cart.findOne({ where: { userId: req.user.id }, include: cartInclude });
    return apiSuccess(res, updated, created ? 201 : 200);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    const item = await CartItem.findOne({ where: { id: req.params.id, cartId: cart.id } });
    if (!item) return apiError(res, 'Item no encontrado', 404);

    const product = await Product.findByPk(item.productId);
    if (product.stock < quantity) return apiError(res, 'Stock insuficiente', 400);

    await item.update({ quantity });

    const updated = await Cart.findOne({ where: { userId: req.user.id }, include: cartInclude });
    return apiSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    const item = await CartItem.findOne({ where: { id: req.params.id, cartId: cart.id } });
    if (!item) return apiError(res, 'Item no encontrado', 404);

    await item.destroy();
    const updated = await Cart.findOne({ where: { userId: req.user.id }, include: cartInclude });
    return apiSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    await CartItem.destroy({ where: { cartId: cart.id } });
    return apiSuccess(res, { message: 'Carrito vaciado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
