import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const prodClient = neon(process.env.NEON_DIRECT_URL!);
const devClient = neon(process.env.NEON_DIRECT_URL_DEV!);

const prodDb = drizzle(prodClient);
const devDb = drizzle(devClient);

async function main() {
  try {
    await migrate(prodDb, {
      migrationsFolder: "src/migrations",
    });
    await migrate(devDb, {
      migrationsFolder: "src/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

void main();
