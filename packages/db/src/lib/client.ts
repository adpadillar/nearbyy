import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../schema";

export function buildDbClient({
  DATABASE_URL,
  DATABASE_TOKEN,
}: {
  DATABASE_URL: string;
  DATABASE_TOKEN: string;
}) {
  return drizzle(
    createClient({ url: DATABASE_URL, authToken: DATABASE_TOKEN }),
    {
      schema,
    },
  );
}
