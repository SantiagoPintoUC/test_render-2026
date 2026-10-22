# Backend - Playgram 🎵

Servidor API REST y capa de persistencia para la plataforma social y musical **Playgram**, desarrollada en el marco del curso **IIC2513 - Tecnologías y Aplicaciones Web (Pontificia Universidad Católica de Chile)**.

---

## Integrantes - Grupo

| Nombre completo | Correo UC | Usuario GitHub |
|---|---|---|
| Diego Maximiliano Ramírez Aguirre | dramireza5@estudiante.uc.cl | idiegoo |
| Sebastián Alexis Valdés Lafi | sxvaldes@uc.cl | sebavaldes02 |
| Santiago Felipe Pinto Manríquez | spintom@uc.cl | SantiagoPintoUC |

## Deploy en Línea

* **Frontend:** [https://grupo-21-iic2513.netlify.app/](https://grupo-21-iic2513.netlify.app/)
* **Backend API:** *(Se agregará la URL pública de producción al desplegar en Render / Railway)*

---

## Stack Tecnológico y Dependencias de la API

La API REST está construida sobre Node.js y utiliza las siguientes librerías de producción:

* **`express` (v4.21.2):** Framework web minimalista para el manejo de rutas, controladores y middlewares.
* **`sequelize` (v6.37.5):** ORM (Object-Relational Mapping) para modelar y gestionar las entidades de la base de datos de manera orientada a objetos.
* **`pg` (v8.13.3) y `pg-hstore` (v2.3.4):** Driver oficial de PostgreSQL para Node.js.
* **`dotenv` (v16.4.7):** Carga de variables de entorno desde el archivo `.env`.
* **`cors` (v2.8.5):** Middleware para habilitar el intercambio de recursos de origen cruzado (CORS) permitiendo peticiones seguras desde el front-end en Netlify o local.
* **`morgan` (v1.10.0):** Logger de peticiones HTTP para monitoreo de llamadas en consola.
* **`bcryptjs` (v3.0.2):** Algoritmo de hashing seguro y salting para contraseñas de usuarios.
* **`jsonwebtoken` (v9.0.2):** Generación y validación de tokens de sesión JWT (JSON Web Tokens).
* **`nodemon` (v3.1.9) [dev]:** Reinicio automático del servidor ante cambios en el código de desarrollo.

El diseño formal del modelo de datos derivado del diagrama E/R se encuentra documentado en [MODELO_RELACIONAL.md](./MODELO_RELACIONAL.md).

---

## 🗄️ Guía de Instalación y Configuración de la Base de Datos (PostgreSQL)

Para que el backend funcione correctamente, se requiere una instancia de **PostgreSQL** accesible localmente o mediante un servicio en la nube. A continuación se presentan las dos formas admitidas para configurar el entorno de base de datos.

### Requisitos Previos
* Tener instalado **PostgreSQL** (versión 14, 15, 16 o 17) con las herramientas de línea de comandos (`psql`), **O BIEN** tener instalado **Docker**.
* Tener instalado **Node.js** (v18 o superior) y **npm**.

---

### Opción A: Configuración Local Nativa con `psql` (Recomendada)

1. **Abrir la consola interactiva de PostgreSQL (`psql`):**
   * En **Windows** (PowerShell o CMD):
     ```bash
     psql -U postgres
     ```
   * En **macOS / Linux**:
     ```bash
     sudo -u postgres psql
     ```
   *(Ingrese la contraseña del superusuario `postgres` cuando el sistema lo solicite).*

2. **Crear la base de datos del proyecto:**
   Ejecute la siguiente sentencia SQL:
   ```sql
   CREATE DATABASE playgram_db;
   ```

3. **Crear un usuario específico con contraseña cifrada:**
   Por buenas prácticas de seguridad, se recomienda crear un usuario dedicado para la aplicación en lugar de usar el superusuario:
   ```sql
   CREATE USER playgram_user WITH ENCRYPTED PASSWORD 'tu_password_segura';
   ```

4. **Asignar permisos y privilegios:**
   Otorgue todos los privilegios sobre la base de datos y su esquema `public` al usuario recién creado:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE playgram_db TO playgram_user;
   ALTER DATABASE playgram_db OWNER TO playgram_user;

   -- Conectarse a la base de datos recién creada:
   \c playgram_db

   -- Asignar permisos en el esquema public (requerido en PostgreSQL 15+):
   GRANT ALL ON SCHEMA public TO playgram_user;
   ALTER SCHEMA public OWNER TO playgram_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO playgram_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO playgram_user;
   ```

5. **Salir de `psql`:**
   ```sql
   \q
   ```

---

### Opción B: Configuración Rápida con Docker

Si prefiere no instalar PostgreSQL de forma nativa en su sistema operativo, puede levantar un contenedor oficial de PostgreSQL ejecutando un único comando en su terminal:

```bash
docker run --name playgram-postgres \
  -e POSTGRES_DB=playgram_db \
  -e POSTGRES_USER=playgram_user \
  -e POSTGRES_PASSWORD=tu_password_segura \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Para verificar que el contenedor se encuentra en ejecución:
```bash
docker ps
```

---

## ⚙️ Configuración de Variables de Entorno (`.env`)

El servidor utiliza la librería `dotenv` para cargar las credenciales de conexión sin exponer secretos en el repositorio de control de versiones.

1. En la raíz del proyecto backend, copie la plantilla de ejemplo:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env`)*

2. Abra el archivo `.env` y configure los parámetros correspondientes a su entorno local (las credenciales reales deben mantenerse privadas):

```env
# Puerto en el que escucha la API
PORT=3000
NODE_ENV=development

# Credenciales de conexión a PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=playgram_db
DB_USER=playgram_user
DB_PASSWORD=tu_password_segura

# Clave secreta y tiempo de expiración para la firma de tokens JWT
JWT_SECRET=escriba_aqui_una_frase_secreta_larga_y_segura
JWT_EXPIRES_IN=7d
```

> **Nota para despliegues en la nube (Render, Railway, Supabase, Neon):**
> Si cuenta con una URL de conexión completa provista por su servicio en la nube, puede configurar alternativamente la variable `DATABASE_URL`:
> `DATABASE_URL=postgresql://usuario:password@host:puerto/nombre_db`

---

## 🚀 Instalación de Dependencias y Ejecución de la API

1. **Instalar dependencias de Node.js:**
   Ejecute en la raíz del repositorio backend:
   ```bash
   npm install
   ```

2. **Inicializar la Base de Datos y sincronizar tablas (Sequelize):**
   Ejecute el script de inicialización del esquema:
   ```bash
   npm run db:init
   ```
   Este comando realiza las siguientes tareas de forma desatendida:
   * Verifica la conexión exitosa con el motor PostgreSQL.
   * Ejecuta `sequelize.sync({ alter: true })` para crear o actualizar automáticamente las tablas base (`usuarios` y `publicaciones`) con sus claves foráneas, índices y restricciones de integridad.

3. **Poblar la Base de Datos con datos iniciales de prueba (Seeds en archivo independiente):**
   Para cargar usuarios y publicaciones iniciales de prueba sin mezclar lógica de esquema con datos, ejecute el script sembrador:
   ```bash
   npm run db:seed
   ```
   Este script se encuentra modularizado en `src/seeders/seed.js` y siembra usuarios con distintos roles (`usuario`, `moderador`), álbumes, tracks, reseñas, comentarios y las relaciones de likes entre usuarios y entidades de forma idempotente (sin duplicar si ya existen).

4. **Verificar las tablas y relaciones con los scripts de prueba:**
   * **Prueba de modelos y relaciones relacionales (Sequelize):**
     ```bash
     npm run test:models
     ```
     Verá en consola los usuarios, sus tracks/reseñas/comentarios gustados y los likes recibidos por cada entidad según el diagrama E/R.
   * **Prueba integral de la API REST (Endpoints de Likes):**
     ```bash
     npm run test:api
     ```
     Levanta un servidor temporal, emite tokens JWT y valida las llamadas a los endpoints de likes en tracks, reseñas, comentarios y publicaciones.

5. **Verificar las tablas creadas en PostgreSQL directamente (Opcional):**
   Puede comprobar que las tablas fueron creadas conectándose a `psql`:
   * En **Windows (PowerShell)**:
     ```powershell
     $env:PGPASSWORD="tu_password_segura"; psql -U playgram_user -d playgram_db
     ```
   * En **macOS / Linux / Bash** (o solicitando contraseña interactiva):
     ```bash
     psql -U playgram_user -d playgram_db -W
     ```
   Y ejecutando el metacomando para listar tablas:
   ```sql
   \dt
   ```
   Deberá observar las tablas `usuarios` y `publicaciones`.

6. **Levantar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará escuchando en `http://localhost:3000`. Puede verificar su estado ingresando en su navegador a:
   [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 📡 Documentación de Endpoints de la API REST

* **URL Base Local:** `http://localhost:3000/api`
* **Formato de Peticiones y Respuestas:** `JSON` (`Content-Type: application/json`)
* **Autenticación:** Mediante Bearer Token en el encabezado `Authorization: Bearer <token_jwt>`.

### Resumen de Endpoints Disponibles

| Método | Endpoint | Autenticación | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Pública | Estado y tiempo de actividad del servidor. |
| `POST` | `/api/auth/register` | Pública | Registro de un nuevo usuario en la plataforma. |
| `POST` | `/api/auth/login` | Pública | Autenticación de credenciales y entrega de token JWT. |
| `GET` | `/api/auth/me` | Protegida (`Bearer`) | Información del perfil del usuario actualmente autenticado. |
| `GET` | `/api/auth/me/likes` | Protegida (`Bearer`) | Lista resumida de todos los likes dados por el usuario. |
| `GET` | `/api/publicaciones` | Pública | **Endpoint principal:** Obtiene las publicaciones para poblar la main page (incluye contadores de likes). |
| `GET` | `/api/publicaciones/:id` | Pública | Obtiene una publicación específica por su ID. |
| `POST` | `/api/publicaciones` | Protegida (`Bearer`) | Crea una nueva publicación asociada al usuario autenticado. |
| `POST` | `/api/publicaciones/:id/like` | Protegida (`Bearer`) | Alterna (toggle) like en una publicación. |
| `GET` | `/api/publicaciones/:id/likes` | Pública | Conteo y lista de usuarios que dieron like a la publicación. |
| `GET` | `/api/tracks` | Pública | Lista de canciones/tracks con su conteo de likes y artista. |
| `GET` | `/api/tracks/:id` | Pública | Detalle de un track. |
| `POST` | `/api/tracks` | Protegida (`Bearer`) | Crea/sube un nuevo track. |
| `POST` | `/api/tracks/:id/like` | Protegida (`Bearer`) | **E/R XML:** Alterna (toggle) like en un Track. |
| `GET` | `/api/tracks/:id/likes` | Pública | Conteo y usuarios que dieron like al Track. |
| `GET` | `/api/resenas` | Pública | Lista de reseñas con su álbum y conteo de likes. |
| `GET` | `/api/resenas/:id` | Pública | Detalle de una reseña. |
| `POST` | `/api/resenas` | Protegida (`Bearer`) | Crea una reseña con calificación para un álbum. |
| `POST` | `/api/resenas/:id/like` | Protegida (`Bearer`) | **E/R XML:** Alterna (toggle) like en una Reseña. |
| `GET` | `/api/resenas/:id/likes` | Pública | Conteo y usuarios que dieron like a la Reseña. |
| `GET` | `/api/comentarios` | Pública | Lista de comentarios (filtrable por `?id_publicacion=X`). |
| `POST` | `/api/comentarios` | Protegida (`Bearer`) | Crea un comentario en una publicación. |
| `POST` | `/api/comentarios/:id/like` | Protegida (`Bearer`) | **E/R XML:** Alterna (toggle) like en un Comentario. |
| `GET` | `/api/comentarios/:id/likes` | Pública | Conteo y usuarios que dieron like al Comentario. |

---

### 1. Autenticación y Usuarios (`/api/auth`)

#### `POST /api/auth/register`
Registra una nueva cuenta de usuario, hasheando la contraseña con `bcrypt` y entregando un token JWT para sesión inmediata.

* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "username": "productor_lofi",
    "email": "productor@playgram.cl",
    "password": "PasswordSegura123!",
    "bio": "Músico independiente y entusiasta del jazz hop.",
    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  }
  ```
* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "message": "Usuario registrado exitosamente en Playgram.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 2,
      "username": "productor_lofi",
      "email": "productor@playgram.cl",
      "bio": "Músico independiente y entusiasta del jazz hop.",
      "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "rol": "usuario",
      "fecha_registro": "2026-10-21T20:44:39.223Z"
    }
  }
  ```
* **Respuestas de Error:**
  * `400 Bad Request`: Si falta algún campo obligatorio (`username`, `email`, `password`), la contraseña tiene menos de 6 caracteres, o si el nombre de usuario o correo ya se encuentran registrados.

---

#### `POST /api/auth/login`
Inicia sesión validando credenciales contra la contraseña cifrada almacenada en la base de datos. Permite autenticarse tanto mediante **email** como por **username**.

* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": "productor@playgram.cl",
    "password": "PasswordSegura123!"
  }
  ```
  *(O alternativamente: `{ "username": "productor_lofi", "password": "PasswordSegura123!" }`)*
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "message": "Inicio de sesión exitoso.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 2,
      "username": "productor_lofi",
      "email": "productor@playgram.cl",
      "bio": "Músico independiente y entusiasta del jazz hop.",
      "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "rol": "usuario",
      "fecha_registro": "2026-10-21T20:44:39.223Z"
    }
  }
  ```
* **Respuestas de Error:**
  * `400 Bad Request`: Si no se proporciona usuario/email o contraseña.
  * `401 Unauthorized`: Si el usuario no existe o la contraseña no coincide.

---

#### `GET /api/auth/me`
Permite al front-end verificar si el token almacenado sigue siendo válido y obtener los datos de la sesión actual.

* **Encabezados:**
  `Authorization: Bearer <token_jwt>`
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "usuario": {
      "id_usuario": 2,
      "username": "productor_lofi",
      "email": "productor@playgram.cl",
      "bio": "Músico independiente y entusiasta del jazz hop.",
      "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "rol": "usuario",
      "fecha_registro": "2026-10-21T20:44:39.223Z"
    }
  }
  ```
* **Respuestas de Error:**
  * `401 Unauthorized`: Si el token no fue provisto, expiró o es inválido.

---

### 2. Entidad Principal: Publicaciones (`/api/publicaciones`)

#### `GET /api/publicaciones`
**Endpoint esencial que puebla la main page del front-end.** Retorna la lista de todas las publicaciones ordenadas cronológicamente de forma descendente (más recientes primero), incluyendo automáticamente la información de perfil del autor (`username`, `avatar_url`, `bio`, `rol`).

* **Parámetros de Consulta (Query Params - Opcionales):**
  * `limit` (int, default: 50): Cantidad máxima de publicaciones por página.
  * `offset` (int, default: 0): Desplazamiento para paginación.
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "total": 2,
    "limit": 50,
    "offset": 0,
    "publicaciones": [
      {
        "id_publicacion": 2,
        "texto": "¿Alguien ha probado mezclar sintetizadores analógicos con beats lo-fi? Dejen sus recomendaciones abajo 👇",
        "id_usuario": 1,
        "fecha_creacion": "2026-10-21T20:00:00.000Z",
        "autor": {
          "id_usuario": 1,
          "username": "diego_sound",
          "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "bio": "Productor musical aficionado y estudiante.",
          "rol": "usuario"
        }
      },
      {
        "id_publicacion": 1,
        "texto": "¡Bienvenidos a Playgram! Acabo de compartir mi primera reseña y nuevo sample en la plataforma 🎵🔥",
        "id_usuario": 1,
        "fecha_creacion": "2026-10-21T19:55:00.000Z",
        "autor": {
          "id_usuario": 1,
          "username": "diego_sound",
          "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "bio": "Productor musical aficionado y estudiante.",
          "rol": "usuario"
        }
      }
    ]
  }
  ```

---

#### `GET /api/publicaciones/:id`
Obtiene los detalles de una publicación en particular identificada por su ID primario, incluyendo los datos de su autor.

* **Parámetro de Ruta:** `id` (entero).
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "publicacion": {
      "id_publicacion": 1,
      "texto": "¡Bienvenidos a Playgram! Acabo de compartir mi primera reseña y nuevo sample en la plataforma 🎵🔥",
      "id_usuario": 1,
      "fecha_creacion": "2026-10-21T19:55:00.000Z",
      "autor": {
        "id_usuario": 1,
        "username": "diego_sound",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "bio": "Productor musical aficionado y estudiante.",
        "rol": "usuario"
      }
    }
  }
  ```
* **Respuestas de Error:**
  * `404 Not Found`: Si la publicación con dicho ID no existe.

---

#### `POST /api/publicaciones`
Crea una nueva publicación en el feed. **Requiere autenticación obligatoria mediante token JWT**: el autor se infiere de forma segura a partir del token provisto en el encabezado `Authorization: Bearer <token_jwt>`, evitando cualquier riesgo de suplantación de identidad.

* **Encabezados:**
  `Authorization: Bearer <token_jwt>`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "texto": "Escuchando el nuevo álbum de Daft Punk en vinilo. ¡Una obra maestra atemporal! 🎧"
  }
  ```
* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "message": "Publicación creada exitosamente.",
    "publicacion": {
      "id_publicacion": 3,
      "texto": "Escuchando el nuevo álbum de Daft Punk en vinilo. ¡Una obra maestra atemporal! 🎧",
      "id_usuario": 1,
      "fecha_creacion": "2026-10-21T20:45:00.000Z",
      "autor": {
        "id_usuario": 1,
        "username": "diego_sound",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "bio": "Productor musical aficionado y estudiante.",
        "rol": "usuario"
      }
    }
  }
  ```
* **Respuestas de Error:**
  * `400 Bad Request`: Si el campo `texto` está vacío.
  * `401 Unauthorized`: Si la petición no incluye el token Bearer o el token es inválido/expirado.

---

## 🧪 Guía de Pruebas con Postman (Paso a Paso)

Para facilitar la revisión y prueba interactiva de la API, el repositorio incluye el archivo listo para importar:
👉 **[`playgram_api.postman_collection.json`](./playgram_api.postman_collection.json)**

### Opción A: Importar la Colección Oficial en Postman (1 Clic)
1. Abra Postman y haga clic en **Import** (esquina superior izquierda).
2. Seleccione o arrastre el archivo `playgram_api.postman_collection.json`.
3. Verá la colección **"Playgram Backend API"** con todas las peticiones organizadas.
4. Las pruebas de Registro y Login guardan **automáticamente** el token JWT en la variable de colección `{{jwt_token}}`, por lo que las peticiones protegidas (como crear publicación o ver `/me`) funcionan de inmediato sin tener que copiar y pegar tokens a mano.

---

### Opción B: Guía Manual Paso a Paso y Salidas Esperadas

Asegúrese de tener el servidor corriendo con `npm run dev` en `http://localhost:3000`.

#### 1. Comprobación del Servidor (Health Check)
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/health`
* **Salida Esperada:**
  * **Código de Estado:** `200 OK`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "status": "ok",
      "servicio": "Playgram Backend API",
      "uptime": 12.45,
      "timestamp": "2026-10-21T21:00:00.000Z"
    }
    ```

#### 2. Registro de Usuario
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/auth/register`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
  ```json
  {
    "username": "oyente_demo",
    "email": "oyente@playgram.cl",
    "password": "Password123!",
    "bio": "Amante de la música y probador de APIs.",
    "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  }
  ```
* **Salida Esperada:**
  * **Código de Estado:** `201 Created`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "message": "Usuario registrado exitosamente en Playgram.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "usuario": {
        "id_usuario": 6,
        "username": "oyente_demo",
        "email": "oyente@playgram.cl",
        "bio": "Amante de la música y probador de APIs.",
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        "rol": "usuario",
        "fecha_registro": "2026-10-21T21:05:00.000Z"
      }
    }
    ```
* **Caso de Error (Email repetido):** Enviar nuevamente el mismo body responderá con código `400 Bad Request` y `{ "error": "El correo electrónico ya se encuentra registrado." }`.

#### 3. Inicio de Sesión (Login)
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
  ```json
  {
    "email": "diego@playgram.cl",
    "password": "Password123!"
  }
  ```
* **Salida Esperada:**
  * **Código de Estado:** `200 OK`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "message": "Inicio de sesión exitoso.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "usuario": {
        "id_usuario": 1,
        "username": "diego_sound",
        "email": "diego@playgram.cl",
        "bio": "Productor musical aficionado y estudiante UC.",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "rol": "usuario",
        "fecha_registro": "2026-10-21T18:00:00.000Z"
      }
    }
    ```
* **Caso de Error (Clave errónea):** Enviar una contraseña incorrecta responderá con código `401 Unauthorized` y `{ "error": "Credenciales inválidas. Usuario o contraseña incorrectos." }`.

#### 4. Obtener Perfil del Usuario Autenticado (`/api/auth/me`)
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/auth/me`
* **Pestaña Authorization:**
  * Seleccione **Type:** `Bearer Token`
  * En el campo **Token:** Pegue el `token` obtenido en el login o registro.
* **Salida Esperada:**
  * **Código de Estado:** `200 OK`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "usuario": {
        "id_usuario": 1,
        "username": "diego_sound",
        "email": "diego@playgram.cl",
        "bio": "Productor musical aficionado y estudiante UC.",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "rol": "usuario",
        "fecha_registro": "2026-10-21T18:00:00.000Z"
      }
    }
    ```
* **Caso de Error (Sin Token):** Si quita el token o envía uno inválido, responderá con código `401 Unauthorized` y mensaje descriptivo de falta de autorización.

#### 5. Obtener Feed de Publicaciones para la Main Page
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/publicaciones`
* **Query Params (Opcionales):** `limit=10&offset=0`
* **Salida Esperada:**
  * **Código de Estado:** `200 OK`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "total": 6,
      "limit": 10,
      "offset": 0,
      "publicaciones": [
        {
          "id_publicacion": 6,
          "texto": "Recordatorio para toda la comunidad: respeten las opiniones críticas...",
          "id_usuario": 4,
          "fecha_creacion": "2026-10-21T20:50:00.000Z",
          "autor": {
            "id_usuario": 4,
            "username": "moderador_playgram",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            "bio": "Cuenta de moderación oficial de la comunidad Playgram.",
            "rol": "moderador"
          }
        },
        {
          "id_publicacion": 5,
          "texto": "Acabo de escuchar por décima vez \"Random Access Memories\" en vinilo...",
          "id_usuario": 3,
          "fecha_creacion": "2026-10-21T20:49:00.000Z",
          "autor": {
            "id_usuario": 3,
            "username": "santiago_critic",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            "bio": "Crítico de rock progresivo, indie y jazz fusión.",
            "rol": "usuario"
          }
        }
      ]
    }
    ```

#### 6. Crear una Nueva Publicación
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/publicaciones`
* **Pestaña Authorization:**
  * Seleccione **Type:** `Bearer Token`
  * Pegue el token JWT activo.
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
  ```json
  {
    "texto": "¡Probando la API de Playgram desde Postman! El feed se actualiza en tiempo real 🎧🔥"
  }
  ```
* **Salida Esperada:**
  * **Código de Estado:** `201 Created`
  * **Cuerpo de Respuesta:**
    ```json
    {
      "message": "Publicación creada exitosamente.",
      "publicacion": {
        "id_publicacion": 7,
        "texto": "¡Probando la API de Playgram desde Postman! El feed se actualiza en tiempo real 🎧🔥",
        "id_usuario": 1,
        "fecha_creacion": "2026-10-21T21:10:00.000Z",
        "autor": {
          "id_usuario": 1,
          "username": "diego_sound",
          "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "bio": "Productor musical aficionado y estudiante UC.",
          "rol": "usuario"
        }
      }
    }
    ```
* **Caso de Error (Sin Token):** Si intenta enviar la petición sin encabezado Authorization, responderá con código `401 Unauthorized` impidiendo la publicación anónima o no autorizada.

---

### 3. Endpoints para Relaciones de Likes de Usuarios (Diagrama XML)

Siguiendo el diagrama Entidad-Relación formalizado en el XML del proyecto (página 2: relaciones `da like` N:M entre `Usuario` y `Track`, `Reseña` y `Comentario`), la API proporciona endpoints para interactuar con estas relaciones:

#### 3.1 Likes en Tracks (`/api/tracks`)
* `POST /api/tracks/:id/like` *(Protegida)*: Da like o quita el like (toggle) del usuario autenticado al track especificado. Retorna `{ isLiked, totalLikes }`.
* `DELETE /api/tracks/:id/like` *(Protegida)*: Elimina el like explícitamente.
* `GET /api/tracks/:id/likes` *(Pública)*: Retorna el conteo total y la lista de usuarios que han dado like al track.

#### 3.2 Likes en Reseñas (`/api/resenas`)
* `POST /api/resenas/:id/like` *(Protegida)*: Alterna (toggle) el like en la reseña con ID `:id`.
* `DELETE /api/resenas/:id/like` *(Protegida)*: Elimina el like explícitamente de la reseña.
* `GET /api/resenas/:id/likes` *(Pública)*: Retorna el conteo total y la lista de usuarios que dieron like a la reseña.

#### 3.3 Likes en Comentarios (`/api/comentarios`)
* `POST /api/comentarios/:id/like` *(Protegida)*: Alterna (toggle) el like en el comentario con ID `:id`.
* `DELETE /api/comentarios/:id/like` *(Protegida)*: Elimina el like explícitamente del comentario.
* `GET /api/comentarios/:id/likes` *(Pública)*: Retorna el conteo total y la lista de usuarios que dieron like al comentario.

#### 3.4 Likes en Publicaciones (`/api/publicaciones`)
* `POST /api/publicaciones/:id/like` *(Protegida)*: Alterna (toggle) el like en la publicación del feed social.
* `DELETE /api/publicaciones/:id/like` *(Protegida)*: Elimina el like explícitamente de la publicación.
* `GET /api/publicaciones/:id/likes` *(Pública)*: Retorna el conteo total y la lista de usuarios que dieron like a la publicación.

#### 3.5 Mis Likes (`/api/auth/me/likes`)
* `GET /api/auth/me/likes` *(Protegida)*: Retorna el resumen consolidado de todos los elementos (tracks, reseñas, comentarios y publicaciones) que le han gustado al usuario autenticado.

---

## Uso de IA

| Modelo | Plataforma | Cómo se usó |
|---|---|---|
| Claude 3.5 Sonnet | claude.ai | Consulta y apoyo conceptual para validar relaciones y cardinalidades en el modelado del diagrama E/R. |
| Gemini 3.8 Flash | Antigravity | *MODELO_RELACIONAL.md*: Creación y actualización de la deducción y formalización tabular del modelo relacional a partir del diagrama E/R en XML, incorporando las relaciones de likes N:M (`likes_tracks`, `likes_resenas`, `likes_comentarios`, `likes_publicaciones`). |
| Gemini 3.8 Flash | Antigravity | *src/models/Usuario.js*: Creación e implementación del modelo Sequelize para la entidad Usuario, configurando validaciones de entrada, encriptación segura de contraseñas mediante bcryptjs y métodos de sanitización JSON. |
| Gemini 3.8 Flash | Antigravity | *src/models/*: Creación de los modelos Sequelize `Album.js`, `Track.js`, `Resena.js`, `Comentario.js`, `LikeTrack.js`, `LikeResena.js`, `LikeComentario.js`, `LikePublicacion.js` y actualización de `index.js` con las asociaciones N:M correspondientes al diagrama XML. |
| Gemini 3.8 Flash | Antigravity | *src/controllers/likeController.js*: Creación del controlador centralizado para manejo de likes (toggle, eliminación, conteo y consulta de mis likes). |
| Gemini 3.8 Flash | Antigravity | *src/controllers/authController.js*: Creación de la lógica de negocio para los endpoints de registro de usuario, login (por email o username) y verificación de perfil (`/me`). |
| Gemini 3.8 Flash | Antigravity | *src/controllers/publicacionController.js*: Creación de la lógica de negocio para obtener las publicaciones que pueblan la main page y creación de posts con validación estricta de token JWT y soporte a reseñas. |
| Gemini 3.8 Flash | Antigravity | *src/controllers/trackController.js*, *resenaController.js*, *comentarioController.js*: Creación de controladores con listado y creación de entidades musicales y sociales asociadas a likes. |
| Gemini 3.8 Flash | Antigravity | *src/routes/*: Creación de rutas modulares `trackRoutes.js`, `resenaRoutes.js`, `comentarioRoutes.js` y actualización de `publicacionRoutes.js`, `authRoutes.js` e .`index.js` |
| Gemini 3.8 Flash | Antigravity | *src/app.js*: Creación y configuración del servidor Express, middlewares esenciales (CORS, Morgan, JSON). |
| Gemini 3.8 Flash | Antigravity | *src/scripts/testModels.js* y *src/scripts/testApiLikes.js*: Creación de scripts de prueba automatizados para verificar consultas relacionales y endpoints HTTP de likes. |
| Gemini 3.8 Flash | Antigravity | *src/seeders/seed.js*: Actualización del sembrador con datos de prueba realistas para álbumes, tracks, reseñas, comentarios y relaciones de likes cruzadas. |
| Gemini 3.8 Flash | Antigravity | *playgram_api.postman_collection.json*: Actualización de la colección de Postman con requests para cada endpoint de likes y autenticación con captura de tokens JWT. |
| Gemini 3.8 Flash | Antigravity | *src/scripts/initDb.js*: Modificación: se agregan logs descriptivos para mejorar el debug entre las líneas 8 a 32. |
| Gemini 3.8 Flash | Antigravity | *README.md*: Documentación continua en la redacción de la documentación técnica guiada para la instalación, configuración y asignación de permisos en la base de datos PostgreSQL (con `psql` y Docker), configuración de variables de entorno, documentación exhaustiva de los endpoints REST y guía interactiva paso a paso para pruebas con Postman. |
