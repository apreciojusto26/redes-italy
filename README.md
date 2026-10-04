# Control de publicaciones · Italy Pizza

Panel compartido para marcar las publicaciones diarias de Italy Pizza.

## Mis negocios

La sección reúne seis guías basadas en los informes de Daniel del 4 de octubre de 2026. El contenido y los temas de vídeos pendientes se mantienen en `config/businesses.ts`; los PDF originales están en `public/informes`.

Cada guía conecta con el grupo correspondiente en Contraseñas, respetando el desbloqueo de la bóveda. Los enlaces de herramientas se leen desde las cuentas existentes mediante `/api/business-resources`, que no devuelve contraseñas.

Para añadir un tutorial, abre la guía, pulsa **Añadir vídeo** y guarda un título y un enlace HTTPS. Los enlaces se comparten entre dispositivos mediante la tabla `business_tutorials` de Turso, creada automáticamente. Los vídeos se alojan en la plataforma de origen y sus permisos deben permitir el acceso al destinatario.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Configurar Turso

1. Crea una base de datos y consulta su URL:

```bash
turso db create italy-pizza-publicaciones
turso db show --url italy-pizza-publicaciones
```

2. Genera un token:

```bash
turso db tokens create italy-pizza-publicaciones
```

3. Copia `.env.example` como `.env.local` y añade los dos valores:

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

4. Reinicia el servidor de desarrollo.

La tabla `publication_checks` se crea automáticamente en la primera conexión. El token solo se utiliza en el servidor y nunca se envía al navegador.
