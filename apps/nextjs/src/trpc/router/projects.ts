import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { FILE_QUOTA } from "~/utils/shared/constants";
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

    async function getProjectFileCountQuery(projectId: string) {
      const countQuery = await ctx.drizzle
        .select({ count: ctx.helpers.count(ctx.schema.files) })
        .from(ctx.schema.files)
        .where(ctx.helpers.eq(ctx.schema.files.projectid, projectId));

      return countQuery[0]?.count ?? 0;
    }

    const ret = projects.map(async (p) => ({
      id: p.externalId,
      name: p.name,
      description: p.description,
      billing: {
        plan: "free",
        usage: {
          files: {
            current: await getProjectFileCountQuery(p.id),
            limit: FILE_QUOTA,
          },
          requests: {
            current: p.runningQueryCount,
            limit: 20_000,
          },
        },
        lastQuotaReset: p.lastQuotaReset,
      },
    }));

    return await Promise.all(ret);
  }),
  createFromCurrentUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      }
      // create an externalId for the project based on the name
      // if the project name is "My Project", the externalId will be "my-project"
      const externalId = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

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
          ctx.helpers.eq(ctx.schema.projects.externalId, externalId),
        ),
      });

      // If it is, we throw an error
      if (existingProject) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project with this name already exists",
        });
      }

      // We insert the project into the database
      await ctx.drizzle.insert(ctx.schema.projects).values({
        externalId: externalId,
        id: crypto.randomUUID(),
        name: input.name,
        owner: ctx.session.userId!,
        description: input.description,
      });

      return { success: true };
    }),

  deleteFromCurrentUser: protectedProcedure
    .input(z.object({ externalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // We delete all of the files associated with the project
      await ctx.drizzle
        .delete(ctx.schema.files)
        .where(ctx.helpers.eq(ctx.schema.files.projectid, input.externalId));

      // We delete the project from the database
      await ctx.drizzle
        .delete(ctx.schema.projects)
        .where(
          ctx.helpers.and(
            ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
            ctx.helpers.eq(ctx.schema.projects.externalId, input.externalId),
          ),
        );

      return { success: true };
    }),
});
