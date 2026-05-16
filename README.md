# MarketAPI

E-commerce fullstack construido como proyecto integrador del bootcamp **Estud-IA Tech — Alcaldía de Medellín**, ruta Programación Desarrollo Backend Junior.

## Demo

| | URL |
|---|---|
| Frontend | https://market-api-swart.vercel.app |
| Backend | https://market-api-6hwc.onrender.com/api |
| Health check | https://market-api-6hwc.onrender.com/health |

> El backend corre en Render free tier — el primer request puede tardar ~30s si el servicio está dormido.

## Credenciales de demo

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@marketapi.com | Admin123! |
| Cliente | juan@test.com | Juan123! |

## Stack

**Backend:** Node.js · Express · Sequelize · PostgreSQL (Supabase)  
**Frontend:** Next.js 14 · TypeScript · Tailwind CSS · sonner  
**Deploy:** Render (backend) · Vercel (frontend) · Supabase (DB)

## Funcionalidades

- Catálogo de productos con filtro por categoría y búsqueda
- Registro y login con JWT (roles: `customer` / `admin`)
- Carrito de compras persistente por usuario
- Checkout y creación de órdenes con descuento de stock
- Historial de órdenes con detalle
- Panel admin: CRUD de productos y gestión de órdenes
- Cron job nocturno que cancela órdenes pendientes +24h y devuelve el stock

## API Endpoints

Base URL: `https://market-api-6hwc.onrender.com/api`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Registro |
| POST | `/auth/login` | ❌ | Login → JWT |
| GET | `/auth/me` | ✅ | Usuario actual |
| GET | `/products` | ❌ | Listar productos (`?category=&search=&page=`) |
| GET | `/products/:id` | ❌ | Detalle producto |
| POST | `/products` | ✅ Admin | Crear producto |
| PUT | `/products/:id` | ✅ Admin | Editar producto |
| DELETE | `/products/:id` | ✅ Admin | Desactivar producto |
| GET | `/categories` | ❌ | Listar categorías |
| GET | `/cart` | ✅ | Mi carrito |
| POST | `/cart/items` | ✅ | Agregar item |
| PUT | `/cart/items/:id` | ✅ | Actualizar cantidad |
| DELETE | `/cart/items/:id` | ✅ | Quitar item |
| GET | `/orders` | ✅ | Mis órdenes (admin ve todas) |
| POST | `/orders` | ✅ | Crear orden desde carrito |
| GET | `/orders/:id` | ✅ | Detalle orden |
| PUT | `/orders/:id/status` | ✅ Admin | Cambiar estado |
| GET | `/orders/admin/summary` | ✅ Admin | Resumen de ventas |

## Correr localmente

### Requisitos
- Node.js 20+
- PostgreSQL o cuenta en Supabase

### Backend

```bash
cd backend
npm install
cp .env.example .env   # completar variables
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# crear .env.local con NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

### Variables de entorno — Backend

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
FRONTEND_URL=http://localhost:3000
```

### Seed de datos

```bash
cd backend
npm run seed
```

## Arquitectura

```
Frontend (Vercel)
    │ REST + JWT
    ▼
Backend (Render)
 Express → Controllers → Sequelize
    │
    ▼
PostgreSQL (Supabase)
```

## Autor

**Jorge Alvarado** — Estud-IA Tech, Programación Backend Junior · Mayo 2026