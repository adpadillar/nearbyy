import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  },
  (categories) => ({
    nameIdx: index("name_idx").on(categories.name),
  }),
);
