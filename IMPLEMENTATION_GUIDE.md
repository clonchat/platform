¡Excelente! Dividir un proyecto complejo en tareas atómicas y secuenciales es precisamente la forma en que los ingenieros de software gestionan la complejidad y es la estrategia perfecta para guiar a una IA de generación de código.

Aquí tienes el plan de ataque. Cada "Tarea" es un prompt autocontenido y procesable. Deben ejecutarse en orden, ya que cada una se basa en la anterior.

---

### **Plan de Ataque para la IA: Generación del Proyecto Clonchat por Fases**

**Instrucción General:** Ejecuta las siguientes tareas en orden secuencial. Cada tarea representa un bloque de construcción fundamental del proyecto.

---

### **Tarea 1: Creación de la Estructura y el Esqueleto del Monorepo**

**Objetivo:** Establecer la base del proyecto, la estructura de directorios y los archivos de configuración iniciales para Turborepo, TypeScript y los workspaces.

**Instrucciones Detalladas:**

1.  **Crea la estructura de directorios raíz** como se especifica en el `README`. Incluye las carpetas vacías: `apps/web`, `apps/api`, `apps/chatbot-py`, `packages/core`, `packages/ui`, `packages/config-typescript`.
2.  **Genera el `package.json` raíz.** Debe definir el nombre del proyecto, marcarlo como privado y, lo más importante, configurar los `workspaces` para que Turborepo pueda encontrar las aplicaciones y paquetes:
    ```json
    {
      "name": "clonchat-monorepo",
      "private": true,
      "scripts": {
        /* Scripts se añadirán más tarde */
      },
      "workspaces": ["apps/*", "packages/*"],
      "devDependencies": {
        "turbo": "latest",
        "typescript": "latest",
        "prettier": "latest"
      }
    }
    ```
3.  **Genera el archivo `turborepo.json`** en la raíz. Configúralo con un pipeline básico para `build`, `dev` y `lint`.
4.  **Genera un `package.json` básico** dentro de cada subdirectorio en `apps/` y `packages/`.
5.  **Crea el paquete `packages/config-typescript`**: Dentro, genera un archivo `tsconfig.base.json` que servirá como la configuración de TypeScript base para todo el monorepo. Incluirá `compilerOptions` estrictos (`strict: true`, `esModuleInterop: true`, etc.).

**Resultado Esperado:** Un esqueleto de proyecto válido con toda la configuración de Turborepo y workspaces lista, sin lógica de aplicación todavía.

---

### **Tarea 2: Implementación del Paquete `core` (Cerebro de Datos)**

**Objetivo:** Definir el esquema completo de la base de datos y la configuración del ORM. Este paquete no tendrá endpoints, solo lógica de datos pura.

**Instrucciones Detalladas:**

1.  **Navega a `packages/core`.**
2.  **Añade las dependencias necesarias** a su `package.json`: `drizzle-orm`, `postgres`. Y como dev dependencies: `drizzle-kit`, `typescript`.
3.  **Crea el archivo `packages/core/src/schema.ts`** y **genera el código Drizzle** exactamente como se define en la sección 5.1 del `README`, incluyendo las tablas `users`, `businesses` y `appointments` con todas sus columnas y relaciones.
4.  **Crea el archivo `packages/core/src/db.ts`**. Este archivo debe importar `postgres` y `drizzle`, configurar la conexión a la base de datos (usando variables de entorno para las credenciales) y exportar una única instancia `db` del cliente Drizzle.
5.  **Crea el archivo `packages/core/drizzle.config.ts`** para configurar Drizzle Kit, apuntando al archivo de esquema y definiendo la carpeta de salida para las migraciones.

**Resultado Esperado:** Un paquete `core` funcional y compilable que exporta los modelos de la base de datos y el cliente Drizzle.

---

### **Tarea 3: Construcción de la API Principal (`apps/api`)**

**Objetivo:** Desarrollar la API de Hono que consumirá el frontend, utilizando el paquete `core` para toda la interacción con la base de datos.

**Instrucciones Detalladas:**

1.  **Navega a `apps/api`.**
2.  **Añade las dependencias:** `hono`, `@hono/zod-validator`, `zod`.
3.  **Añade la dependencia al paquete local** en su `package.json`: `"core": "workspace:*"`.
4.  **Crea el archivo `apps/api/src/index.ts`**.
5.  **Implementa cada endpoint definido en la tabla de la sección 5.2 del `README`.** Para cada endpoint:
    - Usa el validador `zValidator` con el esquema Zod correspondiente para el body de la petición.
    - Importa el cliente `db` y los modelos de tabla desde el paquete `core`.
    - Implementa la lógica de negocio usando Drizzle. Por ejemplo, para `POST /businesses`, usa `db.insert(businesses)...`.
    - Devuelve respuestas JSON estandarizadas.
6.  Para el endpoint `POST /chat/:businessId/message`, simplemente implementa un proxy que haga una llamada `fetch` al servicio FastAPI (ej. `http://localhost:8000/process-message`).

**Resultado Esperado:** Una aplicación Hono completamente funcional que expone toda la API RESTful especificada, conectada al paquete `core`.

---

### **Tarea 4: Andamiaje del Servicio de Chatbot (`apps/chatbot-py`)**

**Objetivo:** Crear el servicio FastAPI básico que actuará como el procesador de lenguaje, aunque en el MVP solo sea un placeholder.

**Instrucciones Detalladas:**

1.  **Navega a `apps/chatbot-py`.**
2.  **Crea un archivo `requirements.txt`** con las dependencias: `fastapi`, `uvicorn`, `pydantic`, `httpx`.
3.  **Crea el archivo `apps/chatbot-py/src/main.py`**.
4.  **Implementa un único endpoint `POST /process-message`** usando FastAPI.
5.  **Define modelos Pydantic** para la entrada (`BusinessInfo`, `Message`) y la salida (`BotResponse`) del endpoint.
6.  **En esta fase MVP**, la lógica del endpoint debe simplemente registrar la petición de entrada y devolver una respuesta JSON hardcodeada, como `{"bot_response": "Mensaje recibido, procesando..."}`.

**Resultado Esperado:** Un servicio FastAPI funcional con un endpoint de placeholder listo para ser expandido en el futuro.

---

### **Tarea 5: Desarrollo del Frontend (`apps/web`) - Autenticación y Layout**

**Objetivo:** Construir la parte pública de la web y el flujo de autenticación para que los usuarios puedan entrar al dashboard.

**Instrucciones Detalladas:**

1.  **Navega a `apps/web`** e inicialízalo como un proyecto Next.js 14+ (con App Router).
2.  **Implementa la página de inicio (`/app/page.tsx`)**. Debe ser un componente de servidor (SSR) con contenido de marketing.
3.  **Crea las rutas y componentes para `/login` y `/register`**. Estos serán componentes de cliente (`'use client'`).
4.  **Implementa la lógica de llamada a la API** para los endpoints `/api/auth/login` y `/api/auth/register`.
5.  **Crea un sistema de gestión de estado de sesión/autenticación** (usando React Context o Zustand) para almacenar el token JWT y los datos del usuario.
6.  **Crea un layout (`/app/dashboard/layout.tsx`)** que proteja las rutas del dashboard, redirigiendo a `/login` si el usuario no está autenticado.

**Resultado Esperado:** Una web con landing page y un flujo de login/registro funcional que da acceso a una zona protegida.

---

### **Tarea 6: Desarrollo del Frontend (`apps/web`) - Dashboard de Gestión**

**Objetivo:** Construir la interfaz principal donde los propietarios gestionan sus negocios y citas.

**Instrucciones Detalladas:**

1.  **Dentro de `/app/dashboard`**, crea los siguientes componentes de cliente:
2.  **Componente `BusinessSettingsForm`**:
    - Permite crear o editar un negocio.
    - Hace llamadas a `POST /businesses` y `PUT /businesses/:id`.
    - Incluye campos para nombre, subdominio, configuración de disponibilidad, etc.
3.  **Componente `AppointmentCalendar`**:
    - Utiliza una librería como `FullCalendar` o `react-big-calendar`.
    - Obtiene los datos de las citas desde el endpoint `GET /appointments/:businessId`.
    - Muestra las citas en una vista de calendario, coloreadas por estado (`pending`, `confirmed`).
    - Al hacer clic en una cita pendiente, abre un modal.
4.  **Componente `AppointmentModal`**:
    - Muestra los detalles de la cita.
    - Contiene botones de "Confirmar" y "Cancelar" que llaman a los endpoints correspondientes de la API.

**Resultado Esperado:** Un dashboard funcional donde el usuario puede configurar su negocio y gestionar sus citas de principio a fin.

---

### **Tarea 7: Desarrollo del Frontend (`apps/web`) - Interfaz Pública del Chatbot**

**Objetivo:** Crear la ventana de chat que verán los clientes finales en los subdominios.

**Instrucciones Detalladas:**

1.  **Implementa la captura de subdominios.** Esto debe hacerse a nivel de Vercel/DNS y middleware en Next.js (`middleware.ts`) para identificar el negocio que se está visitando.
2.  **Crea un componente `ChatWindow` reutilizable** en `packages/ui`.
3.  **En la ruta principal del subdominio**, renderiza una página simple que muestre la información del negocio y el componente `ChatWindow`.
4.  **La lógica de `ChatWindow` debe:**
    - Mantener el estado de la conversación (historial de mensajes).
    - Al enviar un mensaje, hacer una llamada `POST` al endpoint `/api/chat/:businessId/message`.
    - Mostrar la respuesta del bot en la interfaz.

**Resultado Esperado:** Los visitantes de `negocio.clonchat.com` pueden ver y usar una interfaz de chat funcional.

---

### **Tarea 8: Contenerización y Configuración para Despliegue**

**Objetivo:** Preparar los servicios de backend para el despliegue creando sus Dockerfiles y un archivo Docker Compose para un entorno de desarrollo local consistente.

**Instrucciones Detalladas:**

1.  **Crea un `Dockerfile` en `apps/api`**. Debe ser un Dockerfile multi-etapa que compile el código TypeScript y luego copie los artefactos de JavaScript a una imagen ligera de Node.js Alpine.
2.  **Crea un `Dockerfile` en `apps/chatbot-py`**. Debe instalar las dependencias de Python y ejecutar la aplicación con Uvicorn.
3.  **Crea un archivo `docker-compose.yml` en la raíz del proyecto.** Debe definir tres servicios:
    - `database`: Una imagen de PostgreSQL con un volumen para persistencia de datos.
    - `api`: Construido a partir del `Dockerfile` de `apps/api`, conectado a `database`.
    - `chatbot`: Construido a partir del `Dockerfile` de `apps/chatbot-py`.

**Resultado Esperado:** La capacidad de levantar todo el stack de backend y la base de datos con un único comando (`docker-compose up`), listo para el despliegue en Fargate.
