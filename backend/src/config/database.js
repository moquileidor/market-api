const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const sslExplicit = process.env.DATABASE_SSL === 'true';
const sslOff = process.env.DATABASE_SSL === 'false';
const useSSL = sslExplicit || (!sslOff && process.env.NODE_ENV === 'production');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
  },
  dialectOptions: {
    ...(useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}),
    family: 4,
  },
});

module.exports = sequelize;
