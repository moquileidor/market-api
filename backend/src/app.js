const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

module.exports = app;
