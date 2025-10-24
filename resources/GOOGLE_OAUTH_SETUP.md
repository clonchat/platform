# Google OAuth Setup Guide - NextAuth.js

Esta guía te ayudará a configurar Google OAuth con NextAuth.js para Clonchat.

## Requisitos Previos

- Cuenta de Google Cloud Console
- Proyecto de Clonchat configurado
- Acceso a la base de datos PostgreSQL

## Paso 1: Configuración de Google Cloud Console

### 1.1 Crear un Proyecto (si no existe)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto

### 1.2 Habilitar APIs Necesarias

1. Navega a "APIs & Services" > "Library"
2. Busca y habilita las siguientes APIs:
   - **Google Calendar API** (para gestión de citas)
   - **Gmail API** (para envío de correos)
   - **Google+ API** (para información de perfil)

### 1.3 Configurar Pantalla de Consentimiento OAuth

1. Ve a "APIs & Services" > "OAuth consent screen"
2. Elige "External" como tipo de usuario (a menos que tengas Google Workspace)
3. Completa la información requerida:
   - App name: `Clonchat`
   - User support email: tu correo electrónico
   - Developer contact: tu correo electrónico
4. Añade los scopes necesarios:
   ```
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/gmail.send
   ```
5. Para desarrollo: Añade usuarios de prueba
6. Para producción: Publica la aplicación (sigue el proceso de verificación de Google)

### 1.4 Crear Credenciales OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Tipo de aplicación: "Web application"
4. Nombre: "Clonchat Web"
5. Añade URIs de redirección autorizadas:

   **Para desarrollo:**

   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **Para producción:**

   ```
   https://tudominio.com/api/auth/callback/google
   ```

6. Guarda y anota tu **Client ID** y **Client Secret**

## Paso 2: Variables de Entorno

### 2.1 Frontend (apps/web)

Crea o actualiza el archivo `.env.local` en `apps/web`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-aqui-usa-el-comando-de-abajo

# Google OAuth Credentials
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2.2 Generar NEXTAUTH_SECRET

Ejecuta este comando para generar un secret seguro:

```bash
openssl rand -base64 32
```

Copia el resultado y úsalo como valor de `NEXTAUTH_SECRET`.

### 2.3 Backend (apps/api)

Actualiza el archivo `.env` en `apps/api`:

```env
# Mismo secret que en el frontend
NEXTAUTH_SECRET=el-mismo-secret-del-frontend

# Otras variables...
DATABASE_URL=...
```

**IMPORTANTE**: El `NEXTAUTH_SECRET` debe ser el mismo en frontend y backend para que la validación de tokens funcione correctamente.

## Paso 3: Configuración de Base de Datos

NextAuth creará automáticamente las siguientes tablas usando DrizzleAdapter:

- `users` - Información de usuarios
- `accounts` - Tokens de OAuth y cuentas vinculadas
- `sessions` - Sesiones activas
- `verification_tokens` - Tokens de verificación

No necesitas crear estas tablas manualmente. NextAuth y Drizzle se encargan de ello.

## Paso 4: Testing Local

### 4.1 Iniciar Servidores

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev

# Terminal 3 - Base de datos (si usas local)
# Asegúrate de que PostgreSQL esté corriendo
```

### 4.2 Probar el Flujo

1. Abre `http://localhost:3000/login`
2. Haz clic en "Continuar con Google"
3. Autoriza la aplicación en Google
4. Deberías ser redirigido al dashboard
5. Verifica en la base de datos que se crearon los registros en `users` y `accounts`

## Paso 5: Despliegue a Producción

### 5.1 Actualizar Google Cloud Console

1. En la consola de Google Cloud, ve a tus credenciales OAuth
2. Añade el URI de producción:
   ```
   https://tudominio.com/api/auth/callback/google
   ```

### 5.2 Variables de Entorno de Producción

Actualiza las variables en tu servicio de hosting (Vercel, Railway, etc.):

```env
NEXTAUTH_URL=https://tudominio.com
NEXTAUTH_SECRET=el-mismo-secret-pero-en-produccion
GOOGLE_CLIENT_ID=tu-client-id-de-produccion
GOOGLE_CLIENT_SECRET=tu-client-secret-de-produccion
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 5.3 Consideraciones de Seguridad

- ✅ Usa HTTPS en producción (obligatorio para OAuth)
- ✅ No commits `.env` o `.env.local` a git
- ✅ Rota el `NEXTAUTH_SECRET` periódicamente
- ✅ Monitorea los logs de Google Cloud Console
- ✅ Revisa permisos y scopes regularmente

## El Flujo Completo

### Login con Google

1. Usuario hace clic en "Continuar con Google"
2. NextAuth redirige a Google OAuth
3. Usuario autoriza la aplicación
4. Google redirige a `/api/auth/callback/google`
5. NextAuth:
   - Recibe el código de autorización
   - Lo intercambia por access_token y refresh_token
   - Crea/actualiza el usuario en `users`
   - Guarda tokens en `accounts`
   - Crea una sesión JWT
6. Usuario es redirigido al dashboard

### Uso de Google APIs

Cuando necesites acceder a Calendar o Gmail:

```typescript
// En un servidor/API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";

export async function createCalendarEvent() {
  const session = await getServerSession(authOptions);

  // Buscar el access_token en la base de datos
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, session.user.id),
  });

  if (!account) {
    throw new Error("No Google account linked");
  }

  // Usar Google Calendar API
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Crear evento...
}
```

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa**: El URI de redirección no coincide exactamente con el configurado en Google Console.

**Solución**:

- Verifica que no haya trailing slashes
- Asegúrate de usar http vs https correctamente
- El puerto debe coincidir (3000)

### Error: "invalid_client"

**Causa**: Client ID o Client Secret incorrectos.

**Solución**:

- Verifica que copiaste correctamente las credenciales
- Revisa que no haya espacios extra
- Regenera las credenciales si es necesario

### Error: "access_denied"

**Causa**: El usuario rechazó los permisos o faltan scopes.

**Solución**:

- Verifica que todos los scopes estén configurados en Google Console
- Asegúrate de que la app esté publicada (no en modo draft)
- Añade al usuario como tester si estás en desarrollo

### Tokens Expirados

NextAuth maneja automáticamente el refresh de tokens. Si encuentras problemas:

1. Verifica que `access_type: "offline"` esté configurado
2. Asegúrate de que el `refresh_token` se guardó en la BD
3. Revisa los logs de NextAuth con `NEXTAUTH_DEBUG=true`

## Debug Mode

Para activar logs detallados de NextAuth:

```env
NEXTAUTH_DEBUG=true
LOG_LEVEL=debug
```

## Recursos Adicionales

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Gmail API](https://developers.google.com/gmail/api/guides)
- [DrizzleORM with NextAuth](https://authjs.dev/reference/adapter/drizzle)

## Soporte

Si encuentras problemas:

1. Revisa los logs de NextAuth (con DEBUG=true)
2. Verifica la configuración en Google Cloud Console
3. Comprueba que las tablas de BD se crearon correctamente
4. Revisa que las variables de entorno estén cargadas
