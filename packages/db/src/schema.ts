import { doublePrecision, pgTable, serial, text } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").notNull().primaryKey(),
  text: text("text").notNull(),
  url: text("url").notNull(),
  projectid: text("projectid").notNull(),
  type: text("type").notNull(),
  embedding: doublePrecision("embedding").array(1536).notNull(),
});

export const keys = pgTable("keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  salt: text("salt").notNull(),
  projectid: text("projectid").notNull(),
  userid: text("userid").notNull(),
});
