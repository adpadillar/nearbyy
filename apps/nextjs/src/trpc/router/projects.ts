import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  existsFromCurrentUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) {
        // No need to throw an error, just return false
        return false;
      }

      const project = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
          ctx.helpers.eq(ctx.schema.projects.externalId, input),
        ),
      });

      return !!project;
    }),
  getFromCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.drizzle.query.projects.findMany({
      where: ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
    });

    return projects.map((p) => ({
      id: p.externalId,
      name: p.name,
      description: p.description,
      billing: {
        plan: "free",
        usage: {
          requests: {
            current: p.runningQueryCount,
            limit: 20_000,
          },
        },
        lastQuotaReset: p.lastQuotaReset,
      },
    }));
  }),
  createFromCurrentUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        externalId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the externalId is already in use by the user
      const userProjects = await ctx.drizzle.query.projects.findMany({
        where: ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
      });

      // if the user has more than 3 projects, we return 429
      if (userProjects.length >= 3) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You can only have 3 projects",
        });
      }

      const existingProject = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
          ctx.helpers.eq(ctx.schema.projects.externalId, input.externalId),
        ),
      });

      // If it is, we throw an error
      if (existingProject) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project with this externalId already exists",
        });
      }

      // We insert the project into the database
      await ctx.drizzle.insert(ctx.schema.projects).values({
        externalId: input.externalId,
        id: crypto.randomUUID(),
        name: input.name,
        owner: ctx.session.userId!,
        description: input.description,
      });

      return { success: true };
    }),
});
