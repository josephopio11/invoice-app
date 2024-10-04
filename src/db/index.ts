import { Invoices } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POSTGRES,
  max: 20,
});

export const db = drizzle(pool, {
  schema: {
    Invoices,
  },
});
