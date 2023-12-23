// IMPORTANT:
// This file and validators.ts must be kept in sync
// If you add a new table, you must also add it's schema there
// This is because types are inferred from these files,
// if you don't keep them in sync, you'll get type errors

import { numeric, pgTable, serial, text } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  text: text("text"),
  url: text("url"),
  projectid: text("projectid"),
  type: text("type"),
  embedding: numeric("embedding").array(1536),
});

export const keys = pgTable("keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  salt: text("salt").notNull(),
  projectid: text("projectid").notNull(),
});
