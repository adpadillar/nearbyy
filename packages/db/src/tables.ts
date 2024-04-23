import {
  bigint,
  boolean,
  doublePrecision,
  integer,
  json,
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
  tag: text("tag"),
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
  imageUrl: text("imageUrl"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  fullName: text("fullName"),
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
  /** The internal id, unique to all projects */
  id: text("id").primaryKey(),
  /** The user created id, can be repeated between projects */
  externalId: text("externalId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(),
  /** The amount of queries made since `lastQuotaReset` */
  runningQueryCount: integer("runningQueryCount").notNull().default(0),
  /** The lifetime amount of queries in a project */
  queryCount: integer("queryCount").notNull().default(0),
  /** The last time the `runningQueryCount` value was reset */
  lastQuotaReset: timestamp("last_reset", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
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
  embedding: doublePrecision("embedding").array(256).notNull(),
  text: text("text").notNull(),
  tag: text("tag"),
});

export const presignedUrls = pgTable("presigned_urls", {
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  fileId: text("fileId").notNull(),
  status: text("status").notNull().default("PENDING"),
  projectId: text("projectId").notNull(),
  contentType: text("contentType").notNull(),
  url: text("url").notNull(),
  fields: json("fields").$type<Record<string, string>>().notNull(),
});
