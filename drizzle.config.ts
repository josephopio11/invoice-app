import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: "./.env.local",
});

if (typeof process.env.DATABASE_URL_POSTGRES !== "string") {
  throw new Error(
    "Please set your DATABASE_URL_POSTGRES in the .env.local file"
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL_POSTGRES,
  },
});
