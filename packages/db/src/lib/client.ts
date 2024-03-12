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
      similarity: async <
        TableKey extends keyof typeof tables,
        Table extends (typeof tables)[TableKey],
        TableTypes extends helpers.InferSelectModel<Table>,
        FilterKey extends keyof helpers.InferSelectModel<Table>,
        VectorKey extends keyof helpers.InferSelectModel<Table>,
      >({
        table: tablename,
        vector,
        where,
        limit,
      }: {
        table: TableKey;
        vector: {
          [key in VectorKey]: TableTypes[VectorKey] extends number[]
            ? number[]
            : never;
        };
        where: Record<FilterKey, TableTypes[FilterKey]>;
        limit: number;
      }) => {
        const table = tables[tablename];
        const fieldname = Object.keys(vector)[0] as VectorKey;
        const field = table[fieldname];
        const embedding = vector[fieldname];
        const keys = Object.keys(where) as FilterKey[];

        const whereClause = sql.join(
          keys.map((key) => sql`${table[key]} = ${where[key]}`),
          sql` AND `,
        );

        const embeddings = embedding.toString();

        const statement = sql`SELECT ${table}.*, ${field}::vector(1536) <=> '[${sql.raw(
          embeddings,
        )}]' AS distance FROM ${table} WHERE ${whereClause} ORDER BY distance LIMIT ${limit};`;

        const res = await client.execute(statement);

        // Cast the result to the correct type
        const validator = db.validator(tablename);
        type Row = z.infer<typeof validator>;

        return res.rows as Row[];
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
