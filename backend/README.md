# MarketAPI — Backend

API Node.js + Express + Sequelize + PostgreSQL (Día 1: modelos y seed).

## Requisitos

- Node.js 20+
- Proyecto PostgreSQL (por ejemplo [Supabase](https://supabase.com))

## Configuración

1. Copia `.env.example` a `.env` y completa `DATABASE_URL` y `JWT_SECRET`.
2. Para Supabase u otra DB con SSL, deja `DATABASE_SSL=true`. Para Postgres local sin SSL, usa `DATABASE_SSL=false`.

## Comandos

```bash
npm install
npm start
```

En el primer arranque con `NODE_ENV=development`, Sequelize ejecuta `sync({ alter: true })` para crear o actualizar tablas.

```bash
npm run seed
```

Puebla categorías, productos de demo y usuarios de prueba (idempotente con `findOrCreate` donde aplica).

## Usuarios demo (tras `npm run seed`)

- Admin: `admin@marketapi.com` / `Admin123!`
- Cliente: `juan@test.com` / `Juan123!`
