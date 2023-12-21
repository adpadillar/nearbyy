import type { z } from "zod";
import { neon, neonConfig } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";

import * as schema from "../schema";
import * as validators from "../validators";

/**
 *
 * @param url The URL of the database server.
 * @param authToken The authentication token to use when connecting to the database.
 * @returns A Drizzle client connected to the database.
 */
export function buildDbClient({ directUrl }: { directUrl: string }) {
  neonConfig.fetchConnectionCache = true;
  return neonDrizzle(neon(directUrl), { schema });
}

const client = buildDbClient({ directUrl: process.env.NEON_DIRECT_URL! });

export const db = {
  drizzle: client,
  schema,
  validators,
  vector: {
    similarity: async <
      T extends keyof typeof schema,
      U extends z.infer<(typeof validators)[T]>,
    >(
      tablename: T,
      fieldname: keyof (typeof schema)[T],
      embedding: number[],
      limit: number,
    ): Promise<U[]> => {
      const table = schema[tablename];
      const field = table[fieldname];
      const validator = validators[tablename];

      const embeddings = embedding.map((x) => `${x}`).toString();

      const statement = sql`SELECT ${table}.*, ${field}::vector(1536) <=> '[${sql.raw(
        embeddings,
      )}]' AS distance FROM ${table} ORDER BY distance LIMIT ${limit};`;

      const res = await client.execute(statement);

      // parse all the rows
      const wrappedValidator = validator.array();

      const parsed = wrappedValidator.parse(res.rows) as U[];

      return parsed;
    },
  },
};
