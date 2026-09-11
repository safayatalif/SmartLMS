import dns from "node:dns";
import pg from "pg";

dns.setDefaultResultOrder("ipv4first");

const globalForPg = globalThis as unknown as { pgPool?: pg.Pool; pgPoolPromise?: Promise<pg.Pool> };

function parseDatabaseUrl(url: string) {
  const normalized = url.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
  const u = new URL(normalized);
  return {
    hostname: u.hostname,
    port: Number(u.port || 5432),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: decodeURIComponent(u.pathname.replace(/^\//, "")) || "neondb",
  };
}

async function createPool(): Promise<pg.Pool> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const parsed = parseDatabaseUrl(url);
  // Prefer IPv4 — IPv6 routes to Neon often time out on some networks.
  const { address } = await dns.promises.lookup(parsed.hostname, { family: 4 });

  return new pg.Pool({
    host: address,
    port: parsed.port,
    user: parsed.user,
    password: parsed.password,
    database: parsed.database,
    ssl: { rejectUnauthorized: false, servername: parsed.hostname },
    max: 10,
    connectionTimeoutMillis: 20000,
  });
}

export async function getPool() {
  if (globalForPg.pgPool) return globalForPg.pgPool;
  if (!globalForPg.pgPoolPromise) {
    globalForPg.pgPoolPromise = createPool().then((pool) => {
      globalForPg.pgPool = pool;
      return pool;
    });
  }
  return globalForPg.pgPoolPromise;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const pool = await getPool();
  return pool.query<T>(text, params);
}
