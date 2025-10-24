# Plan: Integración de SST para AWS

## 1. Instalación y configuración inicial de SST

### Instalar SST v3 en el root del proyecto

```bash
npm install --save-dev sst aws-cdk-lib
```

### Crear archivo de configuración SST

- **`sst.config.ts`** en el root del proyecto
- Configurar AWS region, stage (production), y estructura del monorepo
- Definir links entre servicios (API URL, Database connection, Chatbot URL)

## 2. Configurar Aurora Serverless v2 PostgreSQL

### Crear stack de base de datos

- **`infra/database.ts`**: Definir RDS Aurora Serverless v2 con PostgreSQL 16
- Configurar autoscaling mínimo (0.5 ACU) y máximo (2 ACU) para optimizar costos
- Crear VPC con subnets públicas y privadas
- Security groups para acceso desde Lambda y App Runner
- Secrets Manager para credenciales de DB

### Actualizar conexión en `packages/core/src/db.ts`

- Usar `Resource.Database.connectionString` de SST
- Mantener compatibilidad con desarrollo local via docker-compose

## 3. Adaptar API para AWS Lambda

### Crear adaptador Lambda para Hono

- **`apps/api/src/lambda.ts`**: Wrapper para convertir eventos Lambda a formato Hono
- Usar `@hono/aws-lambda` adapter
- Mantener `apps/api/src/index.ts` para desarrollo local

### Configurar stack de API

- **`infra/api.ts`**: Definir Function resource con:
  - Runtime: nodejs20.x
  - Memory: 512MB
  - Timeout: 30s
  - Environment variables: DATABASE_URL, CHATBOT_URL, JWT_SECRET
  - Function URL con CORS configurado
- Link con Aurora database
- Configurar bundling para incluir `@clonchat/core` package

### Actualizar `apps/api/package.json`

- Agregar dependencia `@hono/aws-lambda`
- Nuevo script `build:lambda` para compilar versión Lambda

## 4. Desplegar Chatbot Python en App Runner

### Crear stack de chatbot

- **`infra/chatbot.ts`**: Definir Service resource con:
  - Source: Dockerfile en `apps/chatbot-py/`
  - Port: 8000
  - CPU: 1 vCPU
  - Memory: 2GB
  - Environment variables: CHATBOT_PORT
  - Health check en `/health`
- Auto-scaling configurado (1-3 instancias)

### Actualizar CORS en `apps/chatbot-py/src/main.py`

- Configurar allow_origins dinámicamente desde variable de entorno
- Permitir API Lambda URL y Vercel domain

## 5. Configurar secrets y variables de entorno

### Crear stack de secrets

- **`infra/secrets.ts`**:
  - JWT_SECRET en AWS Secrets Manager
  - NextAuth secrets (si aplica)
  - Configurar acceso desde Lambda

### Variables de entorno por servicio

- API Lambda: DATABASE_URL, CHATBOT_URL, JWT_SECRET, NEXTAUTH_URL
- Chatbot: API_URL (para callbacks)
- Web (Vercel): NEXT_PUBLIC_API_URL, CHATBOT_URL

## 6. Configurar outputs y connections

### Crear archivo de outputs

- **`infra/index.ts`**: Stack principal que orquesta todos los recursos
- Exportar URLs de API y Chatbot
- Configurar SST Console para monitoreo

### Configurar Web app para Vercel

- Actualizar `apps/web/lib/api.ts` para usar URL de producción
- Variables de entorno en Vercel:
  ```
  NEXT_PUBLIC_API_URL=<Lambda Function URL>
  NEXT_PUBLIC_CHATBOT_URL=<App Runner URL>
  DATABASE_URL=<Aurora connection string>
  ```

## 7. Scripts y deployment

### Actualizar scripts en root `package.json`

```json
{
  "sst:dev": "sst dev",
  "sst:deploy": "sst deploy --stage production",
  "sst:remove": "sst remove --stage production"
}
```

### Crear archivo `.sst/`

- Agregar `.sst/` a `.gitignore`
- Mantener separación entre dev local y cloud

## 8. Documentación

### Crear guía de deployment

- **`resources/AWS_DEPLOYMENT.md`**:
  - Requisitos previos (AWS credentials, permisos IAM)
  - Pasos para primer deployment
  - Comandos de gestión
  - Costos estimados
  - Troubleshooting común

## Archivos a crear/modificar

**Nuevos archivos:**

- `sst.config.ts`
- `infra/index.ts`
- `infra/database.ts`
- `infra/api.ts`
- `infra/chatbot.ts`
- `infra/secrets.ts`
- `apps/api/src/lambda.ts`
- `resources/AWS_DEPLOYMENT.md`

**Modificar:**

- `package.json` (root)
- `apps/api/package.json`
- `apps/api/src/index.ts` (agregar exports para Lambda)
- `packages/core/src/db.ts` (soporte para conexión SST)
- `apps/chatbot-py/src/main.py` (CORS dinámico)
- `.gitignore` (agregar `.sst/`)

## Notas importantes

- Solo entorno de producción (stage: "production")
- Web app se despliega manualmente en Vercel (fuera de SST)
- Desarrollo local sigue usando docker-compose
- Aurora Serverless se pausará automáticamente sin tráfico (ahorro de costos)
- App Runner usa el Dockerfile existente sin modificaciones
