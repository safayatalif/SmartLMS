import "dotenv/config";
import dns from "node:dns";
import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

dns.setDefaultResultOrder("ipv4first");

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

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL in .env");
    process.exit(1);
  }

  const parsed = parseDatabaseUrl(url);
  const { address } = await dns.promises.lookup(parsed.hostname, { family: 4 });
  const client = new pg.Client({
    host: address,
    port: parsed.port,
    user: parsed.user,
    password: parsed.password,
    database: parsed.database,
    ssl: { rejectUnauthorized: false, servername: parsed.hostname },
  });

  await client.connect();
  const schema = readFileSync(join(process.cwd(), "db/schema.sql"), "utf8");
  await client.query(schema);
  await client.end();
  console.log("Schema applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
