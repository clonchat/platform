# Clonchat Monorepo

Plataforma SaaS para crear y gestionar chatbots especializados en agendamiento de citas y gestión de pedidos.

## Estructura del Proyecto

```
platform/
├── apps/
│   ├── web/              # Frontend Next.js (Landing + Dashboard)
│   ├── api/              # API Hono (Node.js)
│   └── chatbot-py/       # Servicio de chatbot FastAPI (Python)
├── packages/
│   ├── core/             # Esquemas de BD y lógica compartida (Drizzle ORM)
│   ├── ui/               # Componentes React compartidos
│   └── config-typescript/# Configuración TypeScript base
└── docker-compose.yml    # Orquestación de servicios
```

## Requisitos

- Node.js 20+
- Python 3.11+
- Docker y Docker Compose
- PostgreSQL (incluido en Docker Compose)

## Instalación

### 1. Instalar dependencias de Node.js

```bash
cd platform
npm install
```

### 2. Configurar Python para el chatbot

```bash
cd apps/chatbot-py
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
cd ../..
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://clonchat_user:clonchat_password@localhost:5433/clonchat_db
API_PORT=3001
API_URL=http://localhost:3001
CHATBOT_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=your_secure_jwt_secret_here
```

## Desarrollo Local

### Opción 1: Con Docker (Recomendado)

Inicia todos los servicios con Docker Compose:

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en puerto 5433
- API (Hono) en puerto 3001
- Chatbot (FastAPI) en puerto 8000

Para el frontend, ejecuta en otra terminal:

```bash
cd apps/web
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Opción 2: Sin Docker

#### 1. Iniciar PostgreSQL

Asegúrate de tener PostgreSQL corriendo en el puerto 5433.

#### 2. Ejecutar migraciones

```bash
npm run db:generate
npm run db:migrate
```

#### 3. Iniciar servicios

En terminales separadas:

```bash
# Terminal 1: API
cd apps/api
npm run dev

# Terminal 2: Chatbot
cd apps/chatbot-py
source venv/bin/activate  # o venv\Scripts\activate en Windows
npm run dev

# Terminal 3: Frontend
cd apps/web
npm run dev
```

## Scripts Disponibles

### Root

- `npm run dev` - Inicia todos los servicios con Turborepo
- `npm run build` - Construye todos los paquetes
- `npm run lint` - Linting en todos los paquetes
- `npm run db:generate` - Genera migraciones de Drizzle
- `npm run db:migrate` - Aplica migraciones a la BD
- `npm run docker:up` - Inicia servicios Docker
- `npm run docker:down` - Detiene servicios Docker

### Por Servicio

#### apps/web (Frontend)
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Build de producción
- `npm run start` - Inicia servidor de producción

#### apps/api (API)
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Build de producción
- `npm run start` - Inicia servidor de producción

#### apps/chatbot-py (Chatbot)
- `npm run dev` - Desarrollo con hot reload
- `npm run start` - Inicia servidor de producción

## Arquitectura

### Frontend (`apps/web`)
- **Framework**: Next.js 15 con App Router
- **Rutas públicas**: Landing page (`/`), Login (`/login`), Register (`/register`)
- **Rutas protegidas**: Dashboard (`/dashboard/*`)
- **Chatbot público**: Detecta subdominios y muestra interfaz de chat

### API (`apps/api`)
- **Framework**: Hono (ultraligero y rápido)
- **Endpoints**:
  - `/auth/*` - Autenticación y gestión de usuarios
  - `/businesses/*` - CRUD de negocios
  - `/appointments/*` - Gestión de citas
  - `/chat/*` - Proxy al servicio de chatbot

### Chatbot (`apps/chatbot-py`)
- **Framework**: FastAPI
- **Funcionalidad MVP**: Respuestas basadas en palabras clave
- **Futuro**: Integración con LangChain/LangGraph y RAG

### Base de Datos (`packages/core`)
- **ORM**: Drizzle ORM
- **Tablas**:
  - `users` - Usuarios de la plataforma
  - `businesses` - Negocios creados por usuarios
  - `appointments` - Citas agendadas

## Flujo de Desarrollo

1. **Modificar esquema de BD**: Edita `packages/core/src/schema.ts`
2. **Generar migración**: `npm run db:generate`
3. **Aplicar migración**: `npm run db:migrate`
4. **Desarrollar features**: Los cambios se recargan automáticamente

## Deploy

### Frontend (Vercel)
```bash
cd apps/web
vercel deploy --prod
```

### Backend (AWS Fargate o similar)
Usa los Dockerfiles incluidos:
- `apps/api/Dockerfile`
- `apps/chatbot-py/Dockerfile`

## Próximas Características

- [ ] Integración con LangChain/LangGraph
- [ ] RAG con documentos PDF
- [ ] Integración con Google Calendar
- [ ] Sistema de notificaciones por email
- [ ] Dashboard de analytics
- [ ] Multi-idioma completo
- [ ] Webhooks para integraciones

## Soporte

Para preguntas o problemas, contacta a: contact@clonchat.com

## Licencia

Propietario - Todos los derechos reservados.
