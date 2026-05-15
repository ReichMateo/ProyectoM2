# DEPLOYMENT_RAILWAY.md - Guía detallada de deployment en Railway

## Paso 1: Preparar el repositorio

Asegúrate de que tu repositorio GitHub está actualizado con estos archivos:
- `src/` - Código fuente
- `sql/` - Scripts de base de datos
- `test/` - Tests
- `package.json`
- `.env.example` (NO incluyas `.env`)
- `README.md`
- `railway.json` (configuración de Railway)

Verifica que no hay credenciales en el código:

```bash
git rm --cached .env  # Si lo agregaste por error
```

## Paso 2: Crear proyecto en Railway

1. Ve a https://railway.app
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub"
4. Autoriza Railway con tu cuenta GitHub
5. Selecciona el repositorio `ProyectoM2`

## Paso 3: Agregar PostgreSQL

1. En tu proyecto Railway, haz clic en "+ New Service"
2. Busca y selecciona "PostgreSQL"
3. Railway creará automáticamente:
   - Una base de datos PostgreSQL
   - La variable de entorno `DATABASE_URL`

## Paso 4: Configurar Node.js

1. Railway detectará automáticamente Node.js por `package.json`
2. En la pestaña "Variables" del servicio Node.js, verifica que:
   - `DATABASE_URL` está disponible (viene de PostgreSQL)
   - `PORT` está configurado (por defecto 8000 en Railway)

## Paso 5: Inicializar la base de datos

Después de que Railway hace el primer deploy, necesitas ejecutar los scripts SQL:

### Opción A: Desde tu terminal local

```bash
# Obtén DATABASE_URL desde Railway
# Ve a PostgreSQL plugin → "Connect" → copia la URL

export DATABASE_URL="postgresql://..."
psql "$DATABASE_URL" -f sql/init.sql
psql "$DATABASE_URL" -f sql/seed.sql
```

### Opción B: Desde el panel de Railway

1. Ve a tu proyecto en Railway
2. Haz clic en el servicio PostgreSQL
3. Abre la pestaña "Query" o "Connect"
4. Copia y pega el contenido de `sql/init.sql`
5. Ejecuta la consulta
6. Repite con `sql/seed.sql`

### Opción C: Automatizar con script

Crea un archivo `railway-init.js` en la raíz del proyecto:

```javascript
const { exec } = require('child_process');
const fs = require('fs');

if (process.env.DATABASE_URL) {
  const commands = [
    `psql "$DATABASE_URL" -f sql/init.sql`,
    `psql "$DATABASE_URL" -f sql/seed.sql`
  ];
  
  commands.forEach(cmd => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) console.error(`Error: ${error.message}`);
      else console.log(`Executed: ${cmd}`);
    });
  });
}
```

Luego actualiza `package.json` con:

```json
"scripts": {
  "start": "node src/server.js",
  "init-db": "node railway-init.js"
}
```

## Paso 6: Verificar el deployment

1. En Railway, ve a "Deployments"
2. Espera a que el estado sea "Success"
3. Haz clic en tu servicio Node.js
4. Copia la URL pública (ej: `https://miniblog-production.up.railway.app`)
5. Prueba un endpoint:

```bash
curl https://miniblog-production.up.railway.app/authors
```

Deberías obtener un JSON vacío `[]` o con datos si corriste los scripts de seed.

## Paso 7: Monitoreo

En Railway puedes:
- Ver logs en tiempo real
- Monitorear uso de CPU y memoria
- Configurar alertas
- Ver requests HTTP

## Configuración avanzada

### Variables de entorno adicionales

Si necesitas agregar más variables, ve a tu servicio en Railway y:
1. Haz clic en "Variables"
2. Agrega la variable
3. Railway redeploya automáticamente

### Redeploy manual

Para forzar un nuevo deploy:
1. Ve a "Deployments"
2. Haz clic en el último deployment
3. Haz clic en "Redeploy"

### Dominio personalizado

1. Ve a tu proyecto → Settings
2. En "Custom Domain", agrega tu dominio
3. Configura los DNS según las instrucciones de Railway

## Troubleshooting

### Error: "DATABASE_URL is not set"
- Verifica que el plugin PostgreSQL está conectado
- En Variables del servicio Node, confirma que `DATABASE_URL` aparece

### Error: "relation authors does not exist"
- Ejecuta los scripts SQL manualmente (Opción A o B del Paso 5)
- Verifica que no hay conflictos con otras bases de datos

### Deployment fallido
- Ve a Logs y busca el error
- Verifica que `package.json` tiene `"start": "node src/server.js"`
- Confirma que `.env` NO está en git

### La API no responde
- Verifica que Railway muestra estado "Running"
- Comprueba que la URL es correcta (sin `http://` duplicado)
- Prueba con curl desde tu terminal

## Deshabilitar y borrar

Si quieres eliminar el proyecto:
1. Ve a Settings → Delete Project
2. Confirma el nombre del proyecto
3. Tu base de datos y servidor se eliminarán

## URLs útiles

- Railway Dashboard: https://railway.app/dashboard
- Documentación Railway: https://docs.railway.app
- Verificar status: https://status.railway.app
