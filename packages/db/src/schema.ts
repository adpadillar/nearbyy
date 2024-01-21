import {
  bigint,
  boolean,
  doublePrecision,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  profileImageUrl: text("profileImageUrl").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  fullName: text("fullName").notNull(),
  createdAt: bigint("createdAt", { mode: "bigint" }),
  updatedAt: bigint("updatedAt", { mode: "bigint" }),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull(),
  primaryEmailAddressId: text("primaryEmailAddressId").notNull(),
});

export const emails = pgTable("emails", {
  id: text("id").primaryKey(),
  emailAddress: text("emailAddress").notNull(),
  userId: text("userId").notNull(),
  isVerified: boolean("isVerified").notNull(),
});
