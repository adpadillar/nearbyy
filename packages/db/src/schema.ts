import { sql } from "drizzle-orm";
import { index, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    createdAt: timestamp("created_at").default(sql`now()`),
    embeddings: numeric("embeddings").array(),
  },
  (categories) => ({
    nameIdx: index("name_idx").on(categories.name),
  }),
);
