import { z } from "zod";

import { generateKey } from "@nearbyy/auth";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const keysRouter = createTRPCRouter({
  // Generates a key for a project
  generateForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find the project we want to create a key for
      const project = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.externalId, input.projectId),
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
        ),
      });

      // If it does not exist, user does not have a project with that ID
      if (!project) {
        throw new Error("Project not found");
      }

      // Generate an API key for the project
      const key = await generateKey(project.id, ctx.session.userId!);
      return { key };
    }),
  listForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.projectId) {
        return {
          keys: [],
        };
      }

      // Find all keys for the project and the logged in user
      const userProjects = await ctx.drizzle.query.projects.findMany({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.externalId, input.projectId),
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
        ),
        with: { keys: true },
      });

      const project = userProjects.find(
        (p) => p.externalId === input.projectId,
      )!;

      return {
        keys: project.keys.map((k) => ({
          id: k.id,
          description: k.description,
          createdAt: k.createdAt,
        })),
      };
    }),
  deleteKey: protectedProcedure
    .input(
      z.object({
        keyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.drizzle
        .delete(ctx.schema.keys)
        .where(ctx.helpers.eq(ctx.schema.keys.id, input.keyId));

      return {
        success: true,
      };
    }),
});
