# Online Database Setup (Free Tier)

This backend already uses PostgreSQL through Prisma.

## Current Database Setup

- ORM: Prisma
- Provider: PostgreSQL
- Main connection env var: `DATABASE_URL`
- Migration connection env var: `DIRECT_URL`
- Prisma schema: `server/prisma/schema.prisma`

## Is It Local Right Now?

Yes, by default this project points to a local Postgres database in `server/.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tutorflow?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/tutorflow?schema=public"
```

## Role of Docker in This Project

There is currently no Docker setup in this repository (`Dockerfile` or `docker-compose.yml` is not present).

That means:

- Docker is not required for current local development.
- DB can run as a normal local Postgres install, or as a hosted online Postgres service.

## Make Database Online For Free (Neon)

Neon has a free Postgres tier and works well with Prisma.

1. Create a Neon account and project

- Go to `https://neon.tech`
- Create a project and database

2. Copy both Neon connection strings

- `Pooled connection` (for app/runtime)
- `Direct connection` (for Prisma migrations)

3. Update `server/.env`

```env
# Use pooled URL for runtime queries
DATABASE_URL="postgresql://USER:PASSWORD@EP-xxx-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require&pgbouncer=true"

# Use direct URL for migrations
DIRECT_URL="postgresql://USER:PASSWORD@EP-xxx.REGION.aws.neon.tech/DBNAME?sslmode=require"

PORT=4000
JWT_SECRET="replace-with-a-strong-secret"
JWT_EXPIRES_IN="1d"
```

4. Generate Prisma client and apply migrations

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
```

5. Start backend

```bash
npm run dev
```

6. Point frontend to the backend

- In root `.env.local`, set:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

If backend is deployed, replace with your public backend URL, for example:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

## Quick Verification

- Start server and open `http://localhost:4000/api/health` (if you expose health route)
- Register/login from frontend
- Confirm data appears in Neon SQL editor

## Notes

- Keep `DATABASE_URL` and `DIRECT_URL` private.
- For hosted server platforms, add both env vars in the platform dashboard.
- Use `prisma:migrate:deploy` in production/CI, not `prisma migrate dev`.
