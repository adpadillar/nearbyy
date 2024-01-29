import { z } from "zod";

export const postSchema = {
  body: z.object({
    name: z.string(),
    id: z.string(),
    desciption: z.string().optional(),
  }),
  return: z.object({
    project: z
      .object({
        id: z.string(),
      })
      .nullable(),
    error: z.string().nullable(),
  }),
};

export const getSchema = {
  return: z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
    error: z.string().nullable(),
  }),
};
