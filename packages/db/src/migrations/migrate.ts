// OUT OF SERVICE

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const devClient = neon(process.env.NEON_DIRECT_URL_DEV!);
const devDb = drizzle(devClient);

async function main() {
  try {
    console.log("Migrating tables to development database...");
    await migrate(devDb, {
      migrationsFolder: "src/migrations-dev",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

void main();
