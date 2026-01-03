import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.warn(
    "Warning: DATABASE_URL not set. Application will run in in-memory mode. Data will be lost on restart.",
  );
}

export const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
// @ts-ignore
export const db = process.env.DATABASE_URL ? drizzle(pool, { schema }) : null;