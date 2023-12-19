import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";

/**
 *
 * @param url The URL of the database server.
 * @param authToken The authentication token to use when connecting to the database.
 * @returns A Drizzle client connected to the database.
 */
export function buildDbClient({ directUrl }: { directUrl: string }) {
  neonConfig.fetchConnectionCache = true;
  return neonDrizzle(neon(directUrl));
}
