Servicio de autenticación (Node.js + Express + TypeScript + Drizzle ORM sobre PostgreSQL). Emite y valida JWT para que el microservicio de Finanzas autorice solicitudes. Comparte la misma base de datos con Finanzas.

🚀 Ejecutar
Opción A — Docker Compose

Ejecutar desde la carpeta raíz donde está docker-compose.yml (la que levanta postgres, auth y finanzas).

docker compose build --no-cache
docker compose up -d
docker compose logs -f auth

El contenedor corre: db:generate → db:migrate → dev.

El servicio queda en http://localhost:3002.

Opción B — Local (sin Docker)

Requisitos: Node.js 20+, PostgreSQL 16+, npm 10+.

Crear .env (ver sección Variables de entorno).

Instalar y migrar:

npm ci
npm run db:generate
npm run db:migrate
npm run dev

🔧 Variables de entorno

En local (archivo .env):

DATABASE_URL=postgres://fin_user:fin_pass@localhost:5432/fin_db
JWT_SECRET=super_secreto_largo_y_unico
NODE_ENV=development
PORT=3002

Con Docker Compose, las apps se conectan al host postgres:

DATABASE_URL=postgres://fin_user:fin_pass@postgres:5432/fin_db

IMPORTANTE: JWT_SECRET debe ser idéntico en este servicio y en Finanzas.

📁 Estructura
src/
├─ app/
│  ├─ server.ts        # Express app
│  └─ routes.ts        # Rutas /health, /auth/*
├─ middlewares/
│  ├─ error.ts         # Manejo de errores
│  └─ requireAuth.ts   # (para /auth/me)
├─ db/
│  ├─ index.ts         # Conexión Drizzle + Pool PG
│  └─ schema.ts        # Tabla usuarios
└─ modules/
   └─ auth/            # controller.ts, types.ts (zod)

📚 Scripts NPM
{
  "dev": "tsx watch src/app/server.ts",
  "start": "node --enable-source-maps dist/server.js",
  "build": "tsc -p tsconfig.json",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate"
}

🧭 Endpoints

GET /health → sanity check.

POST /auth/register

{ "email": "user@mail.com", "password": "secret123", "nombre": "User", "rol": "admin" }


Respuestas:

201: { "id": 1, "email": "...", "nombre": "...", "rol": "..." }

409 si el email ya existe.

POST /auth/login

{ "email": "user@mail.com", "password": "secret123" }

Respuesta:

{ "token": "<JWT>" }

GET /auth/me (requiere Authorization: Bearer <JWT>)

200: { "user": { "id": 1, "email": "...", "rol": "..." } }

🧪 Pruebas rápidas (curl)
# Register
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"foo@bar.com","password":"secret123","nombre":"Foo","rol":"admin"}'

# Login
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"foo@bar.com","password":"secret123"}'

# Me (reemplazar <TOKEN>)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3002/auth/me

📦 Postman

Importar postman/auth.postman_collection.json.
Variables sugeridas:

{{baseUrlAuth}} = http://localhost:3002

{{jwt}} = (se setea tras login)

🛠 Troubleshooting

401 Invalid token → JWT_SECRET difiere entre servicios.

DB refused → verificar que postgres está healthy (docker compose logs -f postgres).

Windows + hot reload → usar CHOKIDAR_USEPOLLING=true (ya contemplado en el compose).
