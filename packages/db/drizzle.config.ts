import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./src/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_DIRECT_URL!,
  },
} satisfies Config;
