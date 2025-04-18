import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in your environment");
}

const sqlClient = postgres(process.env.DATABASE_URL);

const db = drizzle(sqlClient);

export default db;
