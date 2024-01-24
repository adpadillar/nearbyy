import { neon, neonConfig } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as helpers from "drizzle-orm";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "../schema";
import * as tables from "../tables";

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

const createCustomDatabase = ({ directUrl }: { directUrl: string }) => {
  const client = buildDbClient({ directUrl: directUrl });
  const db = {
    drizzle: client,
    schema,
    validator: <T extends keyof typeof tables>(
      tablename: T,
      schematype: "select" | "insert" = "select",
    ) => {
      const table = tables[tablename];
      const validator =
        schematype === "select"
          ? createSelectSchema(table)
          : createInsertSchema(table);

      const validatorWithDistance = validator.merge(
        z.object({ distance: z.number().optional() }),
      );

      return validatorWithDistance;
    },
    helpers,
    vector: {
      similarity: async <T extends keyof typeof tables>(
        tablename: T,
        fieldname: keyof (typeof tables)[T],
        embedding: number[],
        projectid: string,
        limit = 10,
      ) => {
        const table = tables[tablename];
        const field = table[fieldname];

        const embeddings = embedding.toString();

        const statement = sql`SELECT ${table}.*, ${field}::vector(1536) <=> '[${sql.raw(
          embeddings,
        )}]' AS distance FROM ${table} WHERE projectid = ${projectid} ORDER BY distance LIMIT ${limit};`;

        const res = await client.execute(statement);

        // parse all the rows
        const validator = db.validator(tablename);
        const wrappedValidator = validator.array();
        const parsed = wrappedValidator.parse(res.rows);

        return parsed;
      },
    },
  };

  return db;
};

export const db = createCustomDatabase({
  directUrl: process.env.NEON_DIRECT_URL!,
});

export const devDb = createCustomDatabase({
  directUrl: process.env.NEON_DIRECT_URL_DEV!,
});
