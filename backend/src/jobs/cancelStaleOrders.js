const cron = require('node-cron');
const { Op } = require('sequelize');
const { Order, OrderItem, Product } = require('../models');

async function cancelStaleOrders() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stale = await Order.findAll({
    where: { status: 'pending', createdAt: { [Op.lt]: cutoff } },
    include: [{ model: OrderItem, as: 'items' }],
  });

  if (stale.length === 0) return;

  for (const order of stale) {
    for (const item of order.items) {
      await Product.increment('stock', { by: item.quantity, where: { id: item.productId } });
    }
    await order.update({ status: 'cancelled' });
  }

  // eslint-disable-next-line no-console
  console.info(`[cron] ${stale.length} orden(es) cancelada(s) por inactividad`);
}

const start = () =>
  cron.schedule('0 2 * * *', () => {
    cancelStaleOrders().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[cron] Error al cancelar órdenes:', err);
    });
  });

module.exports = { start };
