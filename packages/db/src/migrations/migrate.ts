import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

export const client = neon(process.env.NEON_DIRECT_URL!);

export const db = drizzle(client);

async function main() {
  try {
    await migrate(db, {
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
