// IMPORTANT
// This file and schema.ts must be kept in sync
// If you add a new table, you must add it's validator here
// This is because types are inferred from these files,
// if you don't keep them in sync, you'll get type errors

// HOW TO ADD VALIDATORS TO THIS FILE
// - All validators must have the same name as the table
// - All validators must be exported from this file
// - All validators must be of type z.object
// - All validators must have the same keys as the table
// - All validators must have the same types as the table
// - When table can be queried by vector embeddings, add
//   an optional distance field of type number

import { z } from "zod";

export const files = z.object({
  id: z.number(),
  text: z.string(),
  url: z.string(),
  projectid: z.string(),
  type: z.string(),
  embedding: z.array(z.number()),
  distance: z.number().optional(),
});

export const keys = z.object({
  id: z.number(),
  key: z.string(),
  salt: z.string(),
  projectid: z.string(),
});
