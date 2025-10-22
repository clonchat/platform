# Getting Started with Clonchat

Esta guía te ayudará a poner en marcha el proyecto Clonchat en tu máquina local.

## Inicio Rápido (5 minutos)

### 1. Instalar Dependencias

```bash
# En la raíz del proyecto
cd platform
npm install
```

### 2. Configurar Variables de Entorno

Ya existe un archivo `.env` en la raíz con la configuración por defecto. Si necesitas modificarlo:

```env
DATABASE_URL=postgresql://clonchat_user:clonchat_password@localhost:5433/clonchat_db
API_PORT=3001
CHATBOT_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=dev_jwt_secret_change_in_production
```

### 3. Iniciar la Base de Datos

```bash
docker-compose up database -d
```

Esto iniciará PostgreSQL en el puerto 5433 (no interfiere con otras instalaciones de PostgreSQL).

### 4. Ejecutar Migraciones

```bash
npm run db:generate
npm run db:migrate
```

### 5. Configurar Python para el Chatbot

```bash
cd apps/chatbot-py

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

cd ../..
```

### 6. Iniciar Todos los Servicios

Opción A: Con Turborepo (requiere terminales separadas para cada servicio)

```bash
# Terminal 1: API
cd apps/api
npm run dev

# Terminal 2: Chatbot
cd apps/chatbot-py
source venv/bin/activate  # Windows: venv\Scripts\activate
npm run dev

# Terminal 3: Frontend
cd apps/web
npm run dev
```

Opción B: Con Docker (más fácil pero más lento para desarrollo)

```bash
docker-compose up
```

## URLs Disponibles

Una vez que todos los servicios estén corriendo:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
  - Health check: http://localhost:3001/health
- **Chatbot**: http://localhost:8000
  - Docs: http://localhost:8000/docs
- **Database**: localhost:5433

## Flujo de Trabajo Típico

### Crear un Usuario

1. Navega a http://localhost:3000
2. Click en "Empezar Gratis" o ve a http://localhost:3000/register
3. Completa el formulario de registro
4. Serás redirigido al dashboard

### Crear tu Primer Negocio

1. En el dashboard, click en "Crear Nuevo Negocio"
2. Completa:
   - Nombre del negocio
   - Descripción
   - Subdominio (ej: `mi-restaurante`)
   - Configuración de citas
3. Click en "Crear Negocio"

### Probar el Chatbot

Para probar el chatbot de tu negocio:

1. Crea un negocio con subdominio `mi-restaurante`
2. Ve a la página de chatbot simulando el subdominio:
   ```
   http://localhost:3000/chatbot?subdomain=mi-restaurante
   ```
3. Interactúa con el chatbot

**Nota**: En producción, el chatbot se accede via `mi-restaurante.clonchat.com`, pero en desarrollo usamos el parámetro de query.

## Comandos Útiles

### Base de Datos

```bash
# Generar nueva migración después de cambios en schema
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Abrir Drizzle Studio (UI para explorar la BD)
cd packages/core
npm run db:studio
```

### Docker

```bash
# Iniciar solo la base de datos
docker-compose up database -d

# Ver logs
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v
```

### Desarrollo

```bash
# Linting
npm run lint

# Build de todos los paquetes
npm run build

# Limpiar builds
npm run clean
```

## Solución de Problemas

### Puerto 5433 ya en uso

Si el puerto 5433 está ocupado, puedes cambiar el puerto en `docker-compose.yml`:

```yaml
ports:
  - "5434:5432"  # Cambia 5433 por otro puerto
```

No olvides actualizar `DATABASE_URL` en `.env`.

### Error de conexión a la base de datos

Asegúrate de que la base de datos esté corriendo:

```bash
docker-compose ps
```

Si no está corriendo:

```bash
docker-compose up database -d
```

### Error "Cannot find module '@clonchat/core'"

Esto significa que los paquetes no se han construido. Ejecuta:

```bash
npm run build
```

### Python: ModuleNotFoundError

Asegúrate de:
1. Haber creado el entorno virtual
2. Haberlo activado
3. Haber instalado las dependencias con `pip install -r requirements.txt`

## Siguiente Paso

Lee el [README.md](./README.md) principal para más detalles sobre la arquitectura y comandos avanzados.

Para desarrollo de features específicos, consulta el [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md).

