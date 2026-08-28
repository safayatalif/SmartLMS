# SmartLMS

Student library for Southeast University — Next.js + **Neon PostgreSQL** (direct SQL via `pg`).

## Setup

1. Copy env and put your Neon connection string:

```bash
cp .env.example .env
```

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
SESSION_SECRET=a-long-random-string-at-least-32-chars
```

Same `DATABASE_URL` works for **local** and **Vercel** (Project → Settings → Environment Variables).

> Tip: the app connects over IPv4 + SSL (some networks hang on Neon’s IPv6). Keep `sslmode=require` in the URL.

2. Install, migrate, seed, run:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed logins

| Role | Login | Password |
|------|--------|----------|
| Admin | `admin@seu.edu.bd` | `admin123` |
| Student | `2024100010063@seu.edu.bd` (or any seeded email) | `student123` |

- Admin → `/admin` (books, members, plans, payments CRUD)
- Student → `/books`

## What’s included

- Marketing site + bilingual EN/BN
- Real sign-in / sign-up (Scan ID still fills fields only)
- Admin CRUD against Neon
- Public catalog/pricing from the database

## Vercel

Add `DATABASE_URL` and `SESSION_SECRET` in Vercel env, redeploy. No Docker required.
