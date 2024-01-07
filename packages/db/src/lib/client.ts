import { neon, neonConfig } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as helpers from "drizzle-orm";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "../schema";

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
  validator: <T extends keyof typeof schema>(
    tablename: T,
    schematype: "create" | "insert" = "create",
  ) => {
    const table = schema[tablename];
    const validator =
      schematype === "create"
        ? createSelectSchema(table)
        : createInsertSchema(table);

    const validatorWithDistance = validator.merge(
      z.object({ distance: z.number().optional() }),
    );

    return validatorWithDistance;
  },
  helpers,
  vector: {
    similarity: async <T extends keyof typeof schema>(
      tablename: T,
      fieldname: keyof (typeof schema)[T],
      embedding: number[],
      limit = 10,
    ) => {
      const table = schema[tablename];
      const field = table[fieldname];

      const embeddings = embedding.toString();

      const statement = sql`SELECT ${table}.*, ${field}::vector(1536) <=> '[${sql.raw(
        embeddings,
      )}]' AS distance FROM ${table} ORDER BY distance LIMIT ${limit};`;

      const res = await client.execute(statement);

      // parse all the rows
      const validator = db.validator(tablename);
      const wrappedValidator = validator.array();
      const parsed = wrappedValidator.parse(res.rows);

      return parsed;
    },
  },
};
