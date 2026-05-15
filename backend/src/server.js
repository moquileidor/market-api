const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { sequelize } = require('./models');
const app = require('./app');
const staleOrdersJob = require('./jobs/cancelStaleOrders');

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  await sequelize.authenticate();
  const isDev = process.env.NODE_ENV !== 'production';
  await sequelize.sync({ alter: isDev });
  staleOrdersJob.start();
  app.listen(PORT, () => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(`Servidor escuchando en el puerto ${PORT}`);
    }
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
