import {
  bigint,
  boolean,
  doublePrecision,
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
