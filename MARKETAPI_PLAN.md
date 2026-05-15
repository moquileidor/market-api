# 🛒 MarketAPI — Plan de Proyecto Integrador

> **Bootcamp:** Estud-IA Tech — Alcaldía de Medellín
> **Ruta:** Programación Desarrollo Backend Junior
> **Tipo:** E-commerce fullstack con API REST + Storefront
> **Tiempo estimado:** 6-7 días con vibe coding
> **Modalidad de desarrollo:** Antigravity IDE + Claude Code

---

## 📋 Tabla de contenidos

1. [Contexto y objetivos](#1-contexto-y-objetivos)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura general](#3-arquitectura-general)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Modelo de datos](#5-modelo-de-datos)
6. [API endpoints](#6-api-endpoints)
7. [Frontend — páginas y rutas](#7-frontend--páginas-y-rutas)
8. [Autenticación y seguridad](#8-autenticación-y-seguridad)
9. [Automatización (Cron Jobs)](#9-automatización-cron-jobs)
10. [Variables de entorno](#10-variables-de-entorno)
11. [Plan de desarrollo día por día](#11-plan-de-desarrollo-día-por-día)
12. [Deploy gratuito](#12-deploy-gratuito)
13. [Reglas del proyecto](#13-reglas-del-proyecto-claude-coderules)
14. [Convenciones de código](#14-convenciones-de-código)
15. [Git workflow](#15-git-workflow)
16. [Checklist final de entrega](#16-checklist-final-de-entrega)

---

## 1. Contexto y objetivos

### ¿Qué es MarketAPI?

**MarketAPI** es una aplicación e-commerce fullstack que demuestra dominio del desarrollo backend con Node.js + Express, integración con base de datos relacional vía ORM, autenticación segura con JWT, automatización con tareas programadas, y consumo desde un frontend moderno construido con Next.js.

### Objetivos académicos

El proyecto cumple **todos los módulos del temario** de Programación Desarrollo Backend Junior:

| Módulo del temario | Componente del proyecto |
|---|---|
| 1. Arquitectura cliente-servidor | Express.js como API REST, Next.js como cliente |
| 2. Bases de datos relacionales | PostgreSQL con tablas relacionadas (one-to-many, many-to-many) |
| 3. Node.js + APIs RESTful | Endpoints REST con verbos HTTP correctos |
| 4. ORM + Migraciones | Sequelize con modelos, asociaciones y migraciones |
| 5. Automatización + Cron jobs | Job nocturno que cancela órdenes pendientes |
| 6. Seguridad + Autenticación | JWT, bcrypt, helmet, CORS, sanitización |
| 7. Depuración y optimización | Logs con Morgan, manejo de errores, índices SQL |
| 8. Proyecto integrador completo | Backend + DB + Frontend desplegados |

### Objetivos técnicos

- ✅ API REST documentada y funcional
- ✅ Base de datos PostgreSQL con relaciones complejas
- ✅ Autenticación JWT con roles (`customer`, `admin`)
- ✅ Frontend Next.js que consume la API
- ✅ Cron job que automatiza limpieza de órdenes
- ✅ Despliegue gratuito y público (Railway + Vercel + Supabase)
- ✅ Repositorio Git con commits semánticos y README profesional

---

## 2. Stack tecnológico

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express.js | ^4.19 | Framework HTTP |
| Sequelize | ^6.37 | ORM |
| pg | ^8.12 | Driver PostgreSQL |
| jsonwebtoken | ^9.0 | Autenticación |
| bcrypt | ^5.1 | Hashing de contraseñas |
| node-cron | ^3.0 | Tareas programadas |
| express-validator | ^7.2 | Validación de inputs |
| helmet | ^7.1 | Headers de seguridad |
| cors | ^2.8 | CORS |
| morgan | ^1.10 | Logging HTTP |
| dotenv | ^16.4 | Variables de entorno |

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 14 (App Router) | Framework React fullstack |
| React | 18 | UI |
| TypeScript | 5.x | Tipado estático |
| TailwindCSS | 3.4 | Estilos utility-first |
| lucide-react | latest | Iconos |
| sonner | latest | Toast notifications |

### Base de datos
- **PostgreSQL 15** alojado en **Supabase** (free tier — 500MB)

### Infraestructura
- **Backend deploy:** Railway (free tier — $5 crédito/mes)
- **Frontend deploy:** Vercel (free tier — ilimitado para hobby)
- **Base de datos:** Supabase (free tier — 500MB)
- **Repositorio:** GitHub (público)

### Herramientas de desarrollo
- **IDE:** Antigravity + Claude Code
- **API testing:** Thunder Client o Postman
- **DB GUI:** Supabase Studio (web) o TablePlus

---

## 3. Arquitectura general

```
┌──────────────────────────────────────────────────────────────────┐
│                          USUARIO                                 │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                             │
│                    Next.js 14 + TypeScript + Tailwind            │
│                                                                  │
│    Server Components ──► Client Components ──► API calls         │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 │ REST + JWT
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (Railway)                             │
│                    Node.js + Express                             │
│                                                                  │
│    Routes ──► Middlewares ──► Controllers ──► Models             │
│      ▲              │              │             │               │
│      │              │              │             │               │
│   Validación    Auth JWT      Lógica         Sequelize           │
│                                                                  │
│    ┌─────────────────────────────────────────────────────┐       │
│    │  CRON JOB (node-cron)                               │       │
│    │  Cada noche a las 02:00 cancela órdenes pendientes  │       │
│    └─────────────────────────────────────────────────────┘       │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 │ Sequelize / pg
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (Supabase)                      │
│                    PostgreSQL 15                                 │
│                                                                  │
│   users ── carts ── cart_items ── products ── categories         │
│     │                                            │               │
│     └─── orders ── order_items ──────────────────┘               │
└──────────────────────────────────────────────────────────────────┘
```

### Patrón arquitectónico
- **Backend:** MVC clásico (Routes → Controllers → Models)
- **Frontend:** Next.js App Router con Server Components por defecto, Client Components solo cuando hay interactividad
- **Comunicación:** REST sobre HTTPS, autenticación con JWT en header `Authorization: Bearer <token>`

---

## 4. Estructura de carpetas

```
marketapi/
├── README.md                          # Documentación principal del proyecto
├── .gitignore
│
├── backend/                           # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js            # Sequelize instance + conexión
│   │   ├── models/
│   │   │   ├── index.js               # Punto de entrada de modelos + asociaciones
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── ProductCategory.js     # Tabla pivote
│   │   │   ├── Cart.js
│   │   │   ├── CartItem.js
│   │   │   ├── Order.js
│   │   │   └── OrderItem.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── routes/
│   │   │   ├── index.js               # Agrupador de rutas
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── cart.routes.js
│   │   │   └── order.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # Verifica JWT
│   │   │   ├── admin.middleware.js    # Verifica rol admin
│   │   │   ├── validate.middleware.js # Maneja errores de validación
│   │   │   └── error.middleware.js    # Error handler global
│   │   ├── validators/
│   │   │   ├── auth.validators.js
│   │   │   ├── product.validators.js
│   │   │   └── order.validators.js
│   │   ├── jobs/
│   │   │   └── cancelStaleOrders.js   # Cron job
│   │   ├── utils/
│   │   │   ├── jwt.js                 # Firmar/verificar tokens
│   │   │   └── apiResponse.js         # Respuestas consistentes
│   │   ├── seeders/
│   │   │   └── seed.js                # Datos iniciales (categorías, productos demo)
│   │   ├── app.js                     # Configuración Express
│   │   └── server.js                  # Punto de entrada
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md                      # README específico del backend
│
└── frontend/                          # Next.js 14 + TypeScript
    ├── app/
    │   ├── layout.tsx                 # Layout raíz (Navbar + Footer)
    │   ├── page.tsx                   # Home — listado de productos
    │   ├── globals.css                # Tailwind base
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── products/
    │   │   └── [id]/page.tsx          # Detalle producto
    │   ├── cart/
    │   │   └── page.tsx
    │   ├── checkout/
    │   │   └── page.tsx
    │   ├── orders/
    │   │   ├── page.tsx               # Mis órdenes
    │   │   └── [id]/page.tsx          # Detalle orden
    │   └── admin/
    │       ├── products/page.tsx      # CRUD admin
    │       └── orders/page.tsx        # Gestión órdenes
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── ProductCard.tsx
    │   ├── CartDrawer.tsx
    │   ├── ProtectedRoute.tsx
    │   └── ui/                        # Botones, inputs, etc
    ├── lib/
    │   ├── api.ts                     # Cliente fetch al backend
    │   └── auth.ts                    # Manejo de token en localStorage
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useCart.ts
    ├── types/
    │   └── index.ts                   # Interfaces TypeScript
    ├── context/
    │   └── AuthContext.tsx
    ├── public/
    ├── .env.local.example
    ├── .gitignore
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── package.json
    └── README.md                      # README específico del frontend
```

---

## 5. Modelo de datos

### Diagrama de relaciones

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email (UQ)  │
│ password    │
│ role        │ ◄── 'customer' | 'admin'
│ createdAt   │
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────┐         ┌────────────────┐
│   carts     │ 1:N     │   cart_items   │
├─────────────┤◄────────┤────────────────┤
│ id (PK)     │         │ id (PK)        │
│ userId (FK) │         │ cartId (FK)    │
└─────────────┘         │ productId (FK) │
                        │ quantity       │
                        └────────┬───────┘
                                 │ N:1
                                 ▼
┌──────────────────┐  N:M  ┌─────────────┐
│   categories     │◄─────►│  products   │
├──────────────────┤       ├─────────────┤
│ id (PK)          │       │ id (PK)     │
│ name             │       │ name        │
│ slug             │       │ description │
└──────────────────┘       │ price       │
                           │ stock       │
                           │ imageUrl    │
                           │ isActive    │
                           └──────┬──────┘
                                  │ 1:N
                                  ▼
┌─────────────┐         ┌────────────────┐
│   orders    │ 1:N     │  order_items   │
├─────────────┤────────►│────────────────│
│ id (PK)     │         │ id (PK)        │
│ userId (FK) │         │ orderId (FK)   │
│ total       │         │ productId (FK) │
│ status      │ ◄── pending|paid|shipped │
│ createdAt   │         │ |delivered|cancelled
└─────────────┘         │ quantity       │
                        │ unitPrice      │ ◄── snapshot del precio
                        └────────────────┘
```

### Reglas de negocio importantes
- Un usuario tiene **un solo carrito activo**
- Al crear una orden, se hace **snapshot del precio** en `orderItems.unitPrice` (no se referencia el precio actual del producto)
- Al crear una orden, el carrito se **vacía automáticamente**
- El stock del producto **se descuenta** al crear la orden
- Una orden en estado `pending` por más de 24h se **cancela automáticamente** (cron job) y devuelve el stock
- Los productos tienen `isActive` para soft-delete (no se borran físicamente)

---

## 6. API endpoints

### Convención general
- Base URL: `/api`
- Respuesta de éxito: `{ success: true, data: ... }`
- Respuesta de error: `{ success: false, error: { message, code? } }`
- Códigos HTTP correctos: 200, 201, 400, 401, 403, 404, 500

### Endpoints

#### Auth `/api/auth`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/register` | ❌ | Registro de usuario |
| POST | `/login` | ❌ | Login → retorna JWT |
| GET | `/me` | ✅ | Usuario actual |

#### Products `/api/products`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | ❌ | Listar (con filtros: `?category=&search=&page=`) |
| GET | `/:id` | ❌ | Detalle |
| POST | `/` | ✅ Admin | Crear |
| PUT | `/:id` | ✅ Admin | Actualizar |
| DELETE | `/:id` | ✅ Admin | Desactivar (soft delete) |

#### Categories `/api/categories`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | ❌ | Listar todas |
| POST | `/` | ✅ Admin | Crear |
| DELETE | `/:id` | ✅ Admin | Eliminar |

#### Cart `/api/cart`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | ✅ | Mi carrito |
| POST | `/items` | ✅ | Agregar item `{productId, quantity}` |
| PUT | `/items/:id` | ✅ | Actualizar cantidad |
| DELETE | `/items/:id` | ✅ | Quitar item |
| DELETE | `/` | ✅ | Vaciar carrito |

#### Orders `/api/orders`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | ✅ | Mis órdenes |
| GET | `/:id` | ✅ | Detalle de orden |
| POST | `/` | ✅ | Crear orden desde carrito |
| PUT | `/:id/status` | ✅ Admin | Cambiar estado |
| GET | `/admin/summary` | ✅ Admin | Resumen de ventas `?from=&to=` |

---

## 7. Frontend — páginas y rutas

| Ruta | Tipo | Auth | Descripción |
|---|---|---|---|
| `/` | Server | ❌ | Home con grid de productos + filtros |
| `/products/[id]` | Server | ❌ | Detalle producto con botón "Agregar al carrito" |
| `/login` | Client | ❌ | Form de login |
| `/register` | Client | ❌ | Form de registro |
| `/cart` | Client | ✅ | Carrito con totales y botón checkout |
| `/checkout` | Client | ✅ | Confirmar orden |
| `/orders` | Client | ✅ | Listado de mis órdenes |
| `/orders/[id]` | Client | ✅ | Detalle de orden |
| `/admin/products` | Client | ✅ Admin | Tabla CRUD de productos |
| `/admin/orders` | Client | ✅ Admin | Gestión de órdenes (cambiar estado) |

### Decisiones de diseño UI
- **Mobile-first** con TailwindCSS
- **Paleta minimalista:** blanco + negro + un acento (azul o esmeralda)
- **Sin librerías de componentes pesadas** (no shadcn, no Chakra) — solo Tailwind + componentes custom
- **Iconos:** lucide-react
- **Notificaciones:** sonner (toast)

---

## 8. Autenticación y seguridad

### Flujo de autenticación
1. Usuario se registra → backend hashea password con `bcrypt` (10 rounds) → guarda en DB
2. Usuario hace login → backend valida → retorna `accessToken` JWT (válido 7 días)
3. Frontend guarda token en `localStorage`
4. Cada request a endpoint protegido envía `Authorization: Bearer <token>`
5. Middleware `auth.middleware.js` verifica token y adjunta `req.user`

### Medidas de seguridad implementadas
- ✅ Passwords hasheadas con `bcrypt`
- ✅ JWT firmado con secret de 256 bits mínimo
- ✅ `helmet` para headers de seguridad
- ✅ `cors` configurado solo para el dominio del frontend
- ✅ Validación de inputs con `express-validator`
- ✅ Sanitización de queries SQL (Sequelize lo hace por defecto)
- ✅ Rate limiting básico con `express-rate-limit` (opcional pero recomendado)
- ✅ Variables sensibles solo en `.env`, nunca en código
- ✅ HTTPS forzado en producción (Railway lo provee automático)

---

## 9. Automatización (Cron Jobs)

### Job: Cancelar órdenes pendientes
**Archivo:** `backend/src/jobs/cancelStaleOrders.js`
**Frecuencia:** Diaria a las 02:00 AM (servidor UTC)
**Lógica:**
1. Buscar órdenes con `status = 'pending'` y `createdAt < NOW() - 24h`
2. Para cada orden:
   - Cambiar `status = 'cancelled'`
   - Devolver el stock de cada `orderItem` al producto correspondiente
3. Loggear cuántas órdenes fueron canceladas

**Expresión cron:** `0 2 * * *`

### Job opcional: Reporte diario de ventas
**Frecuencia:** Diaria a las 23:55
**Lógica:** Calcular total de ventas del día y guardarlo en tabla `daily_reports`

---

## 10. Variables de entorno

### Backend `.env`
```bash
# Server
NODE_ENV=development
PORT=3001

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# JWT
JWT_SECRET=cambiar_por_un_string_largo_y_aleatorio_de_64_chars
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Bcrypt
BCRYPT_ROUNDS=10
```

### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### En producción
- Railway: variables se setean en el dashboard del servicio
- Vercel: variables se setean en Settings → Environment Variables
- `NEXT_PUBLIC_API_URL` apunta a la URL pública de Railway

---

## 11. Plan de desarrollo día por día

### 📅 Día 1 — Setup + DB + Modelos ✅
- [x] Crear repo en GitHub, clonarlo localmente
- [x] Inicializar `backend/` con `npm init -y`
- [x] Instalar dependencias backend
- [x] Crear proyecto en Supabase, copiar `DATABASE_URL`
- [x] Configurar Sequelize y probar conexión
- [x] Crear los 8 modelos con sus asociaciones
- [x] Crear seeder con categorías y productos demo
- [x] Probar que `sequelize.sync({ alter: true })` crea las tablas
- [x] Commit: `chore: initial backend setup with sequelize models`

### 📅 Día 2 — Auth + CRUD productos ✅
- [x] Implementar `authController` (register, login, me)
- [x] Implementar `auth.middleware.js` para JWT
- [x] Implementar `productController` con CRUD completo
- [x] Implementar `categoryController`
- [x] Validadores con `express-validator`
- [x] Probar todos los endpoints con Thunder Client
- [x] Commit: `feat(auth): add auth, products and categories endpoints`

### 📅 Día 3 — Carrito + Órdenes + Cron ✅
- [x] Implementar `cartController`
- [x] Implementar `orderController` (lógica de crear orden desde carrito)
- [x] Lógica de descuento de stock al crear orden
- [x] Implementar cron job `cancelStaleOrders.js`
- [x] Endpoint admin de resumen de ventas
- [x] Manejo de errores global con `error.middleware.js`
- [ ] Probar carrito y órdenes con Thunder Client
- [ ] Commit: `feat(cart): add cart, orders and stale order cron job`

### 📅 Día 4 — Setup Next.js + Home + Detalle ✅
- [x] `npx create-next-app@latest frontend --typescript --tailwind --app`
- [x] Configurar `lib/api.ts` con fetch tipado
- [x] Crear tipos TypeScript en `types/index.ts`
- [x] Implementar `Navbar`, `Footer`, `ProductCard`
- [x] Página Home con grid de productos
- [x] Página detalle producto
- [ ] Commit: `feat(frontend): add home and product detail pages`

### 📅 Día 5 — Auth + Carrito + Checkout en frontend
- [ ] Páginas `/login` y `/register`
- [ ] `AuthContext` con manejo de token
- [ ] `useAuth` hook
- [ ] `useCart` hook + `CartDrawer`
- [ ] Página `/cart` y `/checkout`
- [ ] Página `/orders` con listado
- [ ] Toast notifications con sonner
- [ ] Commit: `feat: auth flow and shopping cart on frontend`

### 📅 Día 6 — Admin + Deploy
- [ ] Páginas admin `/admin/products` y `/admin/orders`
- [ ] Componente `ProtectedRoute` con verificación de rol
- [ ] **Deploy backend en Railway**
- [ ] **Deploy frontend en Vercel**
- [ ] Actualizar variables de entorno con URLs de producción
- [ ] Probar flujo completo en producción
- [ ] README principal con instrucciones y demo
- [ ] Commit: `chore: production deployment`

### 📅 Día 7 (buffer) — Pulir
- [ ] Loading states y skeletons
- [ ] Manejo de errores en UI
- [ ] Responsive mobile
- [ ] Documentación de API en el README
- [ ] Tests manuales del flujo completo
- [ ] Commit: `polish: ux improvements and docs`

---

## 12. Deploy gratuito

### Paso 1 — Supabase (Base de datos)
1. Ir a [supabase.com](https://supabase.com) → crear proyecto
2. Settings → Database → copiar **Connection String** (modo `URI`)
3. Pegarla en `DATABASE_URL` del `.env`
4. Importante: Supabase requiere `ssl: { require: true, rejectUnauthorized: false }` en la config de Sequelize en producción

### Paso 2 — Railway (Backend)
1. Ir a [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Seleccionar el repo, elegir carpeta `backend/`
3. Variables de entorno: copiar todas las de `.env.example`
4. Railway detecta automáticamente Node.js y corre `npm start`
5. Asegurar que `package.json` tiene `"start": "node src/server.js"`
6. Copiar la URL pública generada (ej: `https://marketapi-backend.up.railway.app`)

### Paso 3 — Vercel (Frontend)
1. Ir a [vercel.com](https://vercel.com) → New Project → Import desde GitHub
2. Seleccionar el repo, configurar **Root Directory:** `frontend`
3. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` = URL pública de Railway + `/api`
4. Deploy
5. Vercel asigna un dominio como `marketapi.vercel.app`

### Paso 4 — Conectar todo
- En Railway, agregar variable `FRONTEND_URL` con la URL de Vercel
- En el backend, configurar CORS para aceptar solo esa URL
- Probar registro, login, agregar al carrito y crear orden desde producción

### Mantenerlo gratis indefinidamente
- ✅ Supabase no se pausa con uso esporádico
- ⚠️ Railway free tier da $5/mes — suficiente para un proyecto académico de baja demanda
- ✅ Vercel free tier es ilimitado para proyectos hobby

---

## 13. Reglas del proyecto (Claude Code rules)

> **Estas reglas son OBLIGATORIAS para todo el código generado en este proyecto. Antes de generar cualquier archivo, Claude Code debe leer estas reglas.**

### 🏗️ Arquitectura

1. **Una responsabilidad por archivo.** Los controllers NO acceden a la DB directamente — usan modelos. Las rutas NO contienen lógica de negocio — solo llaman al controller.

2. **Sin código mezclado.** El backend vive en `backend/`, el frontend en `frontend/`. NUNCA mezclar archivos de uno en el otro.

3. **Asociaciones de Sequelize en `models/index.js`.** Cada modelo se define en su propio archivo, pero las relaciones (`hasMany`, `belongsTo`, `belongsToMany`) se declaran solo en `models/index.js` para evitar imports circulares.

4. **Validación antes de lógica.** Toda ruta que reciba datos del usuario DEBE pasar por un validador (`express-validator`) antes de llegar al controller.

### 🔐 Seguridad

5. **NUNCA hardcodear secrets.** Todo lo sensible (JWT secret, DB password, API keys) va en `.env`. Si Claude Code ve un secret hardcodeado, debe rechazar el código.

6. **NUNCA retornar el campo `password`.** Al serializar usuarios, excluir `password` siempre. Usar `attributes: { exclude: ['password'] }` en queries.

7. **Validar el rol antes de operaciones admin.** Todo endpoint que modifica recursos de admin DEBE usar el middleware `admin.middleware.js`.

8. **Bcrypt rounds: 10 mínimo.** No usar menos por velocidad.

### 💻 Código

9. **`async/await` siempre.** Prohibido usar callbacks o `.then().catch()` en código nuevo. Es más limpio y predecible.

10. **`try/catch` en TODA función async de controller.** O usar un wrapper `asyncHandler` para evitar repetir. Sin excepción.

11. **Respuestas API consistentes.** Siempre usar la estructura:
    ```js
    // éxito
    res.json({ success: true, data: ... })
    // error
    res.status(400).json({ success: false, error: { message: '...' } })
    ```

12. **Códigos HTTP correctos.** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error. NO usar 200 para errores.

13. **No `any` en TypeScript.** Si no se conoce el tipo, usar `unknown` y hacer narrowing.

14. **Frontend: Server Components por defecto.** Solo agregar `"use client"` cuando el componente necesita hooks, eventos o estado del navegador.

15. **Tipos compartidos en `types/index.ts`.** Las interfaces de `User`, `Product`, `Order`, etc. se definen una sola vez y se importan donde se necesiten.

### 🎨 UI

16. **Mobile-first.** Empezar los estilos sin breakpoints, agregar `md:` y `lg:` solo cuando sea necesario.

17. **Solo TailwindCSS para estilos.** NO crear archivos `.css` adicionales salvo `globals.css`. NO usar `style={{}}` inline salvo en valores dinámicos imposibles de expresar en Tailwind.

18. **Loading y error states OBLIGATORIOS.** Toda página que hace fetch debe mostrar un estado de carga y un estado de error. Sin excepción.

### 📝 Git y commits

19. **Conventional Commits.** Formato: `tipo(scope): descripción`. Tipos válidos: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`. Ejemplo: `feat(orders): add stale order cancellation job`.

20. **Commits pequeños y frecuentes.** Un commit por funcionalidad terminada. NO acumular cambios masivos.

### 🚫 Anti-patrones prohibidos

21. **Prohibido el código comentado.** Si no se usa, se borra. Git tiene el historial.

22. **Prohibidos los `console.log` en producción.** Usar `morgan` para logs HTTP y, si hace falta debug puntual, removerlo antes de commitear.

23. **Prohibido implementar funcionalidad a medias.** Si una feature no se va a terminar hoy, no se empieza. Mejor 5 endpoints funcionando perfectos que 10 a medias.

24. **Prohibido sobre-ingeniería.** Este es un proyecto académico. NO agregar Redis, microservicios, GraphQL, ni patrones complejos que el temario no exige.

---

## 14. Convenciones de código

### Naming
- **Archivos modelos:** `PascalCase.js` (ej: `User.js`, `OrderItem.js`)
- **Archivos controllers/rutas/middlewares:** `camelCase.js` con sufijo (ej: `authController.js`, `auth.routes.js`)
- **Componentes React:** `PascalCase.tsx` (ej: `ProductCard.tsx`)
- **Hooks:** `useCamelCase.ts` (ej: `useAuth.ts`)
- **Variables y funciones:** `camelCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **Tablas SQL:** `snake_case` plural (ej: `order_items`, `users`)
- **Columnas SQL:** `snake_case`
- **Campos en JSON/JS:** `camelCase` (Sequelize hace el mapeo automático con `underscored: true`)

### Estructura de un controller (ejemplo)
```js
// productController.js
const { Product, Category } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      include: [{ model: Category }],
    });
    return apiSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

module.exports = { list /* ... */ };
```

### Estructura de un componente React (ejemplo)
```tsx
// ProductCard.tsx
import type { Product } from '@/types';
import Link from 'next/link';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} className="border rounded-lg p-4 hover:shadow-md transition">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
    </Link>
  );
}
```

---

## 15. Git workflow

### Branching
- `main` → producción (auto-deploy a Railway y Vercel)
- Desarrollo directo en `main` está permitido para este proyecto académico, pero se prefieren ramas `feat/nombre` para features grandes

### Commits de ejemplo
```
chore: initial project setup
feat(auth): add register and login endpoints
feat(products): add CRUD with admin protection
feat(cart): add cart management
feat(orders): add order creation from cart
feat(orders): add cron job for stale orders
feat(frontend): add home page with product grid
feat(frontend): add auth context and protected routes
feat(frontend): add cart drawer and checkout flow
docs: add README with deployment instructions
fix: cors configuration for production
chore: deploy to railway and vercel
```

### Estructura del README principal
1. Título + descripción + screenshots
2. Demo (links a Vercel + Railway)
3. Stack técnico
4. Arquitectura (diagrama simple)
5. Cómo correr localmente
6. Variables de entorno
7. Endpoints de la API
8. Credenciales demo (admin y customer)
9. Decisiones técnicas relevantes
10. Autor (Jorge) + bootcamp

---

## 16. Checklist final de entrega

### Backend
- [x] Todos los modelos con sus relaciones funcionando
- [x] Auth completo con JWT y bcrypt
- [x] CRUD de productos protegido por rol admin
- [x] CRUD de carrito y órdenes funcionando
- [ ] Cron job ejecutándose en producción *(implementado; se verifica en Railway)*
- [x] Validación en todos los endpoints que reciben input
- [x] Manejo global de errores
- [ ] Deploy en Railway funcionando con DB de Supabase
- [x] README del backend con instrucciones

### Frontend
- [ ] Home con productos consumiendo la API real
- [ ] Detalle de producto
- [ ] Login y registro funcionando
- [ ] Carrito persistente para usuario logueado
- [ ] Checkout que crea orden real
- [ ] Listado y detalle de "Mis órdenes"
- [ ] Panel admin para gestionar productos y órdenes
- [ ] Responsive en mobile
- [ ] Loading y error states en todas las páginas con fetch
- [ ] Deploy en Vercel apuntando al backend de Railway
- [ ] README del frontend con instrucciones

### Repositorio
- [ ] Estructura monorepo `backend/` + `frontend/` *(solo existe `backend/` por ahora)*
- [ ] README principal con demo links y stack
- [x] Commits semánticos en todo el historial *(iniciado; mantener en días siguientes)*
- [ ] `.env.example` en backend y frontend *(backend listo; falta frontend)*
- [x] `.gitignore` correcto (sin `node_modules`, sin `.env`)
- [ ] Capturas de pantalla en README

### Entrega académica
- [ ] Link al repo GitHub público
- [ ] Link al frontend en Vercel (debe abrir y cargar productos)
- [ ] Link al backend en Railway (ruta `/api/products` debe responder)
- [ ] Credenciales de demo en el documento de entrega:
  - Admin: `admin@marketapi.com` / `Admin123!`
  - Customer: `juan@test.com` / `Juan123!`
- [ ] Documento `.docx` o presentación con el repo, los links y las credenciales

---

## 🎯 Cómo usar este plan con Claude Code

1. Pegar este archivo `MARKETAPI_PLAN.md` en la raíz del repo
2. Crear un archivo `CLAUDE.md` que diga: *"Antes de generar cualquier código, lee `MARKETAPI_PLAN.md` completo y respeta TODAS las reglas de la sección 13. Si una regla entra en conflicto con tu sugerencia, gana la regla."*
3. En cada sesión de Claude Code, mencionar: *"Vamos por el Día N del plan. Necesito que generes [X]."*
4. Revisar cada output contra las reglas antes de hacer commit

---

**Autor:** Jorge — Estud-IA Tech, Programación Backend Junior
**Fecha:** Mayo 2026
**Licencia:** MIT (proyecto académico)
