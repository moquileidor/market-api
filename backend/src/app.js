const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: frontendUrl || true,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Ruta no encontrada' } });
});

app.use(errorHandler);

module.exports = app;
