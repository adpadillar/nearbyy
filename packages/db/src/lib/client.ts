import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../schema";

/**
 *
 * @param url The URL of the database server.
 * @param authToken The authentication token to use when connecting to the database.
 * @returns A Drizzle client connected to the database.
 */
export function buildDbClient({
  url,
  authToken,
}: {
  url: string;
  authToken: string;
}) {
  return drizzle(createClient({ url, authToken }), {
    schema,
  });
}
