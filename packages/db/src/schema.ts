import { relations } from "drizzle-orm";
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
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  fullName: text("fullName").notNull(),
  createdAt: bigint("createdAt", { mode: "number" }),
  updatedAt: bigint("updatedAt", { mode: "number" }),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull(),
  primaryEmailAddressId: text("primaryEmailAddressId").notNull(),
});

export const emails = pgTable("emails", {
  id: text("id").primaryKey(),
  emailAddress: text("emailAddress").notNull(),
  userId: text("userId").notNull(),
  isVerified: boolean("isVerified").notNull(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  externalId: text("externalId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(),
});

// Relations
export const filesRelations = relations(files, ({ one }) => {
  return {
    project: one(projects, {
      fields: [files.projectid],
      references: [projects.id],
    }),
  };
});

export const keysRelations = relations(keys, ({ one }) => {
  return {
    project: one(projects, {
      fields: [keys.projectid],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [keys.userid],
      references: [users.id],
    }),
  };
});

export const usersRelations = relations(users, ({ many }) => {
  return {
    emails: many(emails),
    keys: many(keys),
    projects: many(projects),
  };
});

export const emailsRelations = relations(emails, ({ one }) => {
  return {
    user: one(users, {
      fields: [emails.userId],
      references: [users.id],
    }),
  };
});

export const projectsRelations = relations(projects, ({ many, one }) => {
  return {
    files: many(files),
    keys: many(keys),
    owner: one(users, {
      fields: [projects.owner],
      references: [users.id],
    }),
  };
});
