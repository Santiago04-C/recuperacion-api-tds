# 🛍️ API REST - Tienda con Next.js 14 + TypeScript

> **Proyecto de Recuperación - Técnico en Desarrollo de Software**  
> API REST completa con autenticación JWT, CRUD de productos y sistema de logs.

## 🚀 Características Principales

✅ **Autenticación JWT Manual** - Sistema completo con jsonwebtoken + bcryptjs  
✅ **App Router de Next.js 14** - Arquitectura moderna con rutas API  
✅ **Doble Base de Datos** - Prisma (SQLite/PostgreSQL) + MongoDB (Logs)  
✅ **Roles de Usuario** - Sistema de permisos (user/admin)  
✅ **Validaciones Zod** - Validación robusta en todos los endpoints  
✅ **TypeScript** - Tipado fuerte en todo el proyecto  
✅ **Middleware de Protección** - Rutas protegidas automáticamente  
✅ **Colección Postman** - Tests automáticos incluidos  

---

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **MongoDB** (local o MongoDB Atlas)
- **npm** o yarn

---

## 🔧 Instalación y Configuración

### 1️⃣ Clonar e Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install
```

### 2️⃣ Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto (copiar desde `.env.example`):

```env
# Base de datos relacional (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# Para producción con PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# MongoDB para logs
MONGODB_URI="mongodb://localhost:27017/logs_db"

# Para MongoDB Atlas:
# MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/logs_db"

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET="tu-secret-super-seguro-cambialo-en-produccion-12345"

# Entorno
NODE_ENV="development"
```

### 3️⃣ Configurar Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear base de datos y tablas
npx prisma migrate dev --name init

# Poblar con datos de prueba (usuarios admin y user)
npm run prisma:seed
```

### 4️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La API estará disponible en **http://localhost:3000**

---

## 👥 Usuarios de Prueba

Después de ejecutar el seed, tendrás estos usuarios disponibles:

| Email | Contraseña | Rol | Permisos |
|-------|-----------|-----|----------|
| `admin@local.com` | `123456` | admin | Todos los permisos + eliminar productos |
| `user@local.com` | `123456` | user | Ver, crear y editar productos |

---

## 📚 Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### GET `/api/auth/me`
Obtener información del usuario autenticado (requiere token)

### Productos

#### GET `/api/products`
Listar todos los productos

#### GET `/api/products/[id]`
Obtener un producto específico

#### POST `/api/products`
Crear un nuevo producto (requiere autenticación y rol ADMIN)
```json
{
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 50
}
```

#### PUT `/api/products/[id]`
Actualizar un producto (requiere autenticación y rol ADMIN)

#### DELETE `/api/products/[id]`
Eliminar un producto (requiere autenticación y rol ADMIN)

### Logs

#### GET `/api/logs`
Obtener logs del sistema (requiere autenticación y rol ADMIN)

## 🔐 Autenticación

Para endpoints protegidos, incluir el token JWT en el header:
```
Authorization: Bearer <tu-token-jwt>
```

## 🛠️ Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Prisma**: ORM para PostgreSQL/MongoDB
- **MongoDB**: Base de datos para logs
- **Zod**: Validación de esquemas
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Generación y verificación de JWT

## 📁 Estructura del Proyecto

```
├── app/
│   └── api/
│       ├── auth/          # Endpoints de autenticación
│       ├── products/      # CRUD de productos
│       └── logs/          # Logs del sistema
├── lib/
│   ├── auth.ts           # Utilidades de autenticación
│   ├── jwt.ts            # Manejo de JWT
│   ├── mongodb.ts        # Conexión a MongoDB
│   ├── prisma.ts         # Cliente de Prisma
│   └── validations.ts    # Esquemas de validación Zod
├── models/
│   └── Log.ts            # Modelo de logs para MongoDB
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   └── seed.ts           # Datos de prueba
└── middleware.ts         # Middleware de autenticación
```

## 👥 Roles de Usuario

- **USER**: Usuario estándar (puede ver productos)
- **ADMIN**: Administrador (puede crear, editar y eliminar productos)

## 📝 Licencia

MIT