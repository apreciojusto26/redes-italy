# Control de publicaciones · Italy Pizza

Panel compartido para marcar las publicaciones diarias de Italy Pizza.

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
