import {
  bigint,
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  url: text("url").notNull(),
  projectid: text("projectid").notNull(),
  type: text("type").notNull(),
  embedding: doublePrecision("embedding").array(1536).notNull(),
});

export const keys = pgTable("keys", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  salt: text("salt").notNull(),
  projectid: text("projectid").notNull(),
  userid: text("userid").notNull(),
  description: text("description"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  fullName: text("fullName").notNull(),
  createdAt: bigint("createdAt", { mode: "number" }),
  updatedAt: bigint("updatedAt", { mode: "number" }),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull(),
  primaryEmailAddressId: text("primaryEmailAddressId").notNull(),
});

export const emails = pgTable("emails", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  emailAddress: text("emailAddress").notNull(),
  userId: text("userId").notNull(),
  isVerified: boolean("isVerified").notNull(),
});

export const projects = pgTable("projects", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  externalId: text("externalId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(),
});

// Chunk has to include
// -> Text
// -> File it belongs to
// -> Project it belongs to
// -> Order of the chunk
// -> Next chunk if chunk was split
// -> Embedding of the chunk
// -> Token length of the chunk
export const chunks = pgTable("chunks", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  fileId: text("fileId").notNull(),
  projectId: text("projectId").notNull(),
  nextChunkId: text("nextChunkId"),
  order: integer("order").notNull(),
  tokens: integer("tokens").array().notNull(),
  tokenLength: integer("tokenLength").notNull(),
  embedding: doublePrecision("embedding").array(1536).notNull(),
  text: text("text").notNull(),
});
