# SETUP_LOCAL.md - Guía para ejecutar MiniBlog API en tu máquina local

## Requisitos
- Node.js 18+ (ya tienes instalado: v25.9.0)
- PostgreSQL 14+
- Git (opcional)

## Paso 1: Instalar PostgreSQL en Windows

### Descarga
1. Ve a https://www.postgresql.org/download/windows/
2. Descarga el instalador (versión 14 o superior)
3. Ejecuta el instalador

### Instalación
1. Sigue los pasos del asistente
2. Cuando pida contraseña para usuario `postgres`, establece una (ej: `postgres`)
3. Anota el puerto (por defecto 5432)
4. Completa la instalación

### Verificar instalación
Abre PowerShell y ejecuta:

```powershell
& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -c "SELECT version();"
```

Si ves una versión de PostgreSQL, ¡está funcionando!

## Paso 2: Crear base de datos para MiniBlog

Abre PowerShell como administrador:

```powershell
& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -c "CREATE DATABASE miniblog;"
```

Verifica que se creó:

```powershell
& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -l
```

Deberías ver `miniblog` en la lista.

## Paso 3: Configurar .env local

En la carpeta `ProyectoM2`, crea o edita `.env`:

```env
DATABASE_URL=postgresql://postgres:tuContraseña@localhost:5432/miniblog
PORT=4000
```

Reemplaza `tuContraseña` con la que estableciste al instalar PostgreSQL.

## Paso 4: Inicializar tablas y datos

Abre PowerShell en la carpeta `ProyectoM2`:

```powershell
cd c:\Users\losdo\OneDrive\Desktop\ProyectoM2

# Crear tablas
& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -d miniblog -f sql\init.sql

# Cargar datos de ejemplo
& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -d miniblog -f sql\seed.sql
```

## Paso 5: Iniciar la API

```powershell
cd c:\Users\losdo\OneDrive\Desktop\ProyectoM2
& 'C:\Program Files\nodejs\npm.cmd' start
```

La API estará en `http://localhost:4000`

## Paso 6: Probar endpoints

Abre otra PowerShell o usa una herramienta como Postman/Insomnia:

```powershell
# Listar autores
Invoke-WebRequest -Uri "http://localhost:4000/authors" -Method GET

# Crear autor
Invoke-WebRequest -Uri "http://localhost:4000/authors" -Method POST -ContentType "application/json" -Body '{"name":"Test","email":"test@example.com","bio":"Tester"}'

# Listar posts
Invoke-WebRequest -Uri "http://localhost:4000/posts" -Method GET
```

## Paso 7: Ejecutar tests

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test
```

## Troubleshooting

### PostgreSQL no inicia
```powershell
# Reiniciar el servicio de PostgreSQL
net stop postgresql-x64-15
net start postgresql-x64-15
```

### Error: "connection refused"
- Verifica que PostgreSQL está corriendo (Services en Windows)
- Comprueba que puerto 5432 está disponible
- Verifica `DATABASE_URL` en `.env`

### Error: "password authentication failed"
- Verifica la contraseña en `DATABASE_URL`
- Intenta resetear: 
  ```powershell
  & 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -c "ALTER USER postgres WITH PASSWORD 'nueva_contraseña';"
  ```

### Error: "database miniblog does not exist"
- Ejecuta: `& 'C:\Program Files\PostgreSQL\15\bin\psql' -U postgres -c "CREATE DATABASE miniblog;"`

### npm install no funciona
```powershell
# Usa la ruta completa de npm
& 'C:\Program Files\nodejs\npm.cmd' install
```

## Versiones verificadas

- Node.js: 25.9.0 ✅
- npm: 11.12.1 ✅
- PostgreSQL: 14+ (recomendado)

## Herramientas útiles

### pgAdmin (GUI para PostgreSQL)
Se instala junto con PostgreSQL. Accede en http://localhost/pgadmin

### DBeaver (administrador de BD)
Descarga gratis desde https://dbeaver.io

### Postman (probar API)
Descarga desde https://www.postman.com/downloads/

### Thunder Client (VS Code)
Extensión de VS Code para probar endpoints

## Recursos

- [PostgreSQL Windows Setup](https://www.postgresql.org/docs/current/install-windows.html)
- [Node.js Download](https://nodejs.org/)
- [Express Guide](https://expressjs.com/)
