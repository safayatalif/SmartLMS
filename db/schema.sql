-- SmartLMS schema (Neon / Postgres)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'STUDENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('active', 'pending', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('paid', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  period JSONB NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  blurb JSONB NOT NULL,
  features JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  name TEXT NOT NULL,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  slug TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  author TEXT NOT NULL,
  category JSONB NOT NULL,
  tier TEXT NOT NULL REFERENCES plans(id),
  pages INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,1) NOT NULL DEFAULT 0,
  copies INTEGER NOT NULL DEFAULT 0,
  borrowed INTEGER NOT NULL DEFAULT 0,
  summary JSONB NOT NULL,
  palette JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status member_status NOT NULL DEFAULT 'active',
  joined DATE NOT NULL DEFAULT CURRENT_DATE,
  books_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'paid',
  paid_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_books_tier ON books(tier);
CREATE INDEX IF NOT EXISTS idx_members_plan ON members(plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
