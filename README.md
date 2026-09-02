# English Forever Web

Frontend de English Forever construido con Angular 17 y Angular Material. Consume la API del proyecto hermano `languages-back`.

## Requisitos

- Node.js 20 LTS y npm.
- La API `languages-back` configurada y en ejecución.
- Para administrar el sistema, el backend debe contener el usuario activo `ADM000001`.

## Instalación y ejecución local

```bash
npm install
npm start
```

Abre `http://localhost:4200`. Desarrollo utiliza `http://localhost:8080` como API, según `src/environments/environment.development.ts`.

Orden inicial:

1. Inicia MongoDB y el backend.
2. Crea y activa `ADM000001` siguiendo el README de `languages-back`.
3. Confirma que la API responde en `http://localhost:8080`.
4. Ejecuta `npm start` en este proyecto.

`proxy.conf.json` contiene reglas locales para `/api` y `/auth`, aunque los servicios actuales utilizan directamente la URL del archivo de entorno.

## Configuración de producción

La URL pública de la API se lee en tiempo de ejecución desde `src/env.js`:

```javascript
// Configuración pública: nunca coloques secretos aquí.
window.__env = {
  API_URL: 'https://api.example.com'
};
```

`env.js` se copia al build y se carga antes de Angular. Puedes reemplazar el archivo publicado para cambiar de API sin recompilar. `API_URL` debe incluir el protocolo y no llevar diagonal final.

Si `API_URL` no está definido, producción usa el valor alternativo de `src/environments/environment.ts`. Revísalo antes de publicar para evitar conexiones al backend equivocado.

El backend debe permitir exactamente el origen del frontend:

```dotenv
CORS_ORIGIN=https://app.example.com
FRONTEND_URL=https://app.example.com
```

No agregues tokens, contraseñas, claves de OpenAI ni secretos a `environment.ts`, `environment.development.ts` o `env.js`: todo archivo del frontend es público.

## Compilación y publicación

```bash
npm ci
npm run build
```

El resultado se genera en:

```text
dist/english-forever/browser/
```

Publica ese contenido en un hosting estático. El servidor debe redirigir rutas desconocidas a `index.html` para que funcione Angular Router. El proyecto incluye `src/_redirects` para proveedores compatibles.

El build descarga Google Fonts porque `src/index.html` las referencia. El entorno de compilación necesita acceso a `fonts.googleapis.com`, o las fuentes deberán alojarse localmente.

## Primer acceso y usuarios

La creación y activación inicial de `ADM000001` se realiza desde el backend, no desde este frontend. Después:

1. Inicia sesión con `ADM000001`.
2. Entra a **Administración de usuarios**.
3. Crea las cuentas necesarias; nacen como `inactive`.
4. Habilita cada cuenta cuando corresponda.
5. Usa la misma acción para deshabilitarla.

La interfaz no permite deshabilitar ni eliminar `ADM000001`, y el backend vuelve a validar la protección. Una cuenta deshabilitada recibe `401` aunque conserve un token anterior.

Actualmente no existe una pantalla frontend para `/auth/set-password`. La contraseña inicial del administrador debe establecerse mediante la API, como explica el README del backend. Antes de enviar enlaces de activación por correo a otros usuarios, implementa o despliega una ruta `/set-password` que consuma ese endpoint.

## Verificación antes de publicar

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Después del despliegue verifica:

- `env.js` apunta a la API correcta.
- `/login` no produce errores de CORS.
- `ADM000001` inicia sesión y abre Administración de usuarios.
- Una cuenta habilitada puede iniciar sesión.
- Una cuenta deshabilitada recibe `401`.
- Recargar directamente una ruta del navegador no produce `404`.

## Comandos

```bash
npm start       # servidor local en http://localhost:4200
npm run build   # build de producción
npm run watch   # build de desarrollo en observación
npm test        # pruebas con Karma
```

## Problemas comunes

- **CORS:** la URL del navegador debe coincidir exactamente con `CORS_ORIGIN`.
- **API equivocada:** abre el `env.js` servido y revisa `window.__env.API_URL`.
- **404 al recargar:** configura el fallback del hosting a `index.html`.
- **Falla al compilar fuentes:** permite Google Fonts o aloja las fuentes localmente.
- **No existe administrador:** detén la publicación y ejecuta `admin:create` en el backend.
- **Usuario nuevo sin acceso:** debe ser habilitado por `ADM000001`.
