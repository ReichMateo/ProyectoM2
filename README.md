# MiniBlog API

API REST en Node.js + Express para gestionar autores, posts y comentarios con PostgreSQL.

## Descripción
MiniBlog es un servicio sencillo de contenidos que expone endpoints CRUD para `authors` y `posts`, con una entidad adicional `comments` para comentarios. La API usa consultas SQL parametrizadas a través de `pg` y está lista para desplegar en Railway.

## Requisitos
- Node.js 18+
- PostgreSQL 14+

## Instalación local

### Paso 1: Configurar variables de entorno
Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL. Ejemplo para PostgreSQL local:

```env
DATABASE_URL=postgresql://postgres:tuContraseña@localhost:5432/miniblog
PORT=4000
```

### Paso 2: Crear la base de datos
Si no existe aún la base de datos `miniblog`, créala:

```bash
psql -U postgres -c "CREATE DATABASE miniblog;"
```

### Paso 3: Inicializar tablas y datos
Ejecuta los scripts SQL:

```bash
psql "$DATABASE_URL" -f sql/init.sql
psql "$DATABASE_URL" -f sql/seed.sql
```

### Paso 4: Instalar dependencias
```bash
npm install
```

### Paso 5: Iniciar el servidor
```bash
npm start
```

El servidor escuchará en `http://localhost:4000` por defecto.

Para desarrollo con hot-reload:

```bash
npm run dev
```

## Endpoints principales
- `GET /authors` - Listar autores
- `GET /authors/:id` - Obtener autor
- `POST /authors` - Crear autor
- `PUT /authors/:id` - Actualizar autor
- `DELETE /authors/:id` - Eliminar autor
- `GET /posts` - Listar posts
- `GET /posts/:id` - Obtener post
- `GET /posts/author/:authorId` - Posts de un autor
- `POST /posts` - Crear post
- `PUT /posts/:id` - Actualizar post
- `DELETE /posts/:id` - Eliminar post
- `GET /comments` - Listar comentarios
- `POST /comments` - Crear comentario

## Tests
Ejecuta las pruebas unitarias:

```bash
npm test
```

Para ejecutar con cobertura:

```bash
npm test -- --coverage
```

## Documentación OpenAPI
El archivo `openapi.yaml` contiene la especificación de la API. Puedes visualizarla en:
- [Swagger Editor](https://editor.swagger.io/) (copia el contenido de `openapi.yaml`)
- O servir localmente con `swagger-ui`

## Deployment en Railway

### Configuración en Railway

1. **Crear un proyecto en Railway**
   - Ve a [railway.app](https://railway.app)
   - Crea un nuevo proyecto

2. **Agregar PostgreSQL**
   - En tu proyecto, haz clic en "+ New Service"
   - Selecciona "Database" y elige PostgreSQL
   - Railway creará automáticamente la base de datos

3. **Conectar el repositorio**
   - Sube este repositorio a GitHub
   - En Railway, conecta tu repo GitHub
   - Selecciona "Deploy from GitHub"

4. **Configurar variables de entorno**
   - Ve a "Variables" en tu proyecto
   - Railway agregará automáticamente `DATABASE_URL` del plugin PostgreSQL
   - Asegúrate de que `PORT` esté configurado (por defecto 4000)

5. **Iniciar el deployment**
   - Railway ejecutará automáticamente `npm start`
   - Los scripts SQL (`init.sql` y `seed.sql`) se ejecutan manualmente después del primer deploy

### Ejecutar scripts SQL en Railroad

Después del primer deploy, conéctate a la base de datos y ejecuta:

```bash
# En tu terminal local con acceso a la DB_URL de Railway
psql "$DATABASE_URL" -f sql/init.sql
psql "$DATABASE_URL" -f sql/seed.sql
```

O usa el cliente SQL de Railway directamente desde el panel.

### Monitoreo y logs

- Ve a la pestaña "Logs" en Railway para ver logs de tu aplicación
- Usa "Network" para ver tráfico HTTP
- Monitorea métricas en "Metrics"

## Estructura del proyecto

```
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── server.js                 # Punto de entrada
│   ├── db/
│   │   └── index.js              # Conexión a PostgreSQL
│   ├── services/
│   │   ├── authorsService.js     # Lógica CRUD de autores
│   │   ├── postsService.js       # Lógica CRUD de posts
│   │   └── commentsService.js    # Lógica CRUD de comentarios
│   ├── routes/
│   │   ├── authors.js            # Rutas de autores
│   │   ├── posts.js              # Rutas de posts
│   │   └── comments.js           # Rutas de comentarios
│   └── middlewares/
│       ├── errorHandler.js       # Manejador global de errores
│       └── asyncHandler.js       # Wrapper para async/await
├── test/
│   └── app.test.js               # Tests unitarios
├── sql/
│   ├── init.sql                  # Creación de tablas
│   └── seed.sql                  # Datos iniciales
├── openapi.yaml                  # Especificación OpenAPI
├── .env.example                  # Ejemplo de variables
├── package.json
└── README.md
```

## Validaciones

### Authors
- `name`: no vacío, requerido
- `email`: único, requerido, formato válido

### Posts
- `title`: no vacío, requerido
- `content`: no vacío, requerido
- `author_id`: debe existir en la tabla authors, requerido
- `published`: booleano, opcional (default: false)

### Comments
- `content`: no vacío, requerido
- `post_id`: debe existir en la tabla posts, requerido
- `author_id`: debe existir en la tabla authors, requerido

## Códigos HTTP esperados

- `200 OK` - Lectura exitosa
- `201 Created` - Recurso creado
- `204 No Content` - Eliminación exitosa
- `400 Bad Request` - Validación fallida
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Buenas prácticas implementadas

✅ Consultas SQL parametrizadas (sin SQL injection)
✅ Separación de rutas y lógica de negocio (services)
✅ Manejo global de errores
✅ Validaciones de entrada
✅ Códigos HTTP apropiados
✅ Variables de entorno configurables
✅ Tests unitarios con supertest
✅ Especificación OpenAPI

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Copia `.env.example` a `.env`
- Verifica que `DATABASE_URL` esté configurado correctamente

### Error: "password authentication failed for user"
- Verifica credenciales de PostgreSQL en `DATABASE_URL`
- Comprueba que PostgreSQL está corriendo en tu máquina local

### Error: "relation authors does not exist"
- Ejecuta `psql "$DATABASE_URL" -f sql/init.sql` para crear las tablas

### Tests fallan sin conectar a BD
- Asegúrate de que PostgreSQL está accesible
- Verifica que `.env` tiene `DATABASE_URL` válido

## Uso de IA

Este proyecto fue desarrollado con asistencia de IA para:
- Estructura inicial del proyecto (scaffolding)
- Generación de endpoints CRUD
- Tests unitarios con supertest
- Documentación OpenAPI
- Estructura de carpetas y arquitectura

La IA fue utilizada como herramienta de apoyo siguiendo buenas prácticas de desarrollo y manteniendo el código bajo control del developer.

## Licencia

MIT

