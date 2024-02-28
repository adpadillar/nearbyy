import { relations } from "drizzle-orm";

import { chunks, emails, files, keys, projects, users } from "./tables";

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
    chunks: many(chunks),
    keys: many(keys),
    owner: one(users, {
      fields: [projects.owner],
      references: [users.id],
    }),
  };
});

export const chunksRelations = relations(chunks, ({ one }) => {
  return {
    project: one(projects, {
      fields: [chunks.projectId],
      references: [projects.id],
    }),
    file: one(files, {
      fields: [chunks.fileId],
      references: [files.id],
    }),
    nextChunk: one(chunks, {
      fields: [chunks.nextChunkId],
      references: [chunks.id],
    }),
  };
});
