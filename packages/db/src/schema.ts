import { numeric, pgTable, serial, text } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  text: text("text"),
  url: text("url"),
  projectid: text("projectid"),
  type: text("type"),
  embedding: numeric("embedding").array(1536),
});
