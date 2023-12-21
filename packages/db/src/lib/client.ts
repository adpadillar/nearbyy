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

/**
 * The database client.
 * Includes the drizzle client, the custom vector client, the schema, and the validators.
 *
 * @field drizzle The Drizzle client.
 * @field vector The vector client.
 * @field schema The schema of the database.
 * @field validators The validators for the database.
 */
export const db = {
  /**
   * The Drizzle client. Result of `buildDbClient`.
   */
  drizzle: client,
  /**
   * The schema of the database. Includes all the tables and fields.
   * Each field HAS to have a validator, defined in `validators`.
   */
  schema,
  /**
   * The validators for the database. Includes all the tables and fields.
   * Each validator CORRESPONDS to a table in `schema`.
   */
  validators,
  /**
   * The vector client. Allows you to query the database for similar embeddings.
   * This is a custom client, running custom pg-vector queries through Drizzle.
   */
  vector: {
    /**
     * Allows you to query the database for similar embeddings.
     *
     * @param tablename the name of the table to query
     * @param fieldname the field in the table to query
     * @param embedding the embedding to query against
     * @param limit the limit of results to return
     * @returns the results of the query as an array of objects
     */
    similarity: async <
      T extends keyof typeof schema,
      U extends z.infer<(typeof validators)[T]>,
    >(
      tablename: T,
      fieldname: keyof (typeof schema)[T],
      embedding: number[],
      limit = 10,
    ): Promise<U[]> => {
      const table = schema[tablename];
      const field = table[fieldname];
      const validator = validators[tablename];

      const embeddings = embedding.toString();

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
