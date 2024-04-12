import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { chunking } from "@nearbyy/embeddings";

import { getPresignedUrl } from "~/utils/server/getPresignedUrl";
import { TextExtractor } from "~/utils/server/TextExtractor";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const CLOUDFRONT_URL = "https://dzpv5o2pvfxys.cloudfront.net";

export const filesRouter = createTRPCRouter({
  uploadForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        fileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.externalId, input.projectId),
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
        ),
      });

      if (!project) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      const countQuery = await ctx.drizzle
        .select({ count: ctx.helpers.count(ctx.schema.files) })
        .from(ctx.schema.files)
        .where(ctx.helpers.eq(ctx.schema.files.projectid, project.id));

      const projectFileCount = countQuery[0]?.count ?? 0;

      if (projectFileCount + 1 > 250) {
        throw new TRPCError({
          message: "Project file limit exceeded",
          code: "TOO_MANY_REQUESTS",
        });
      }

      const fileUrl = `${CLOUDFRONT_URL}/${input.fileId}`;

      const file = await fetch(fileUrl);
      const fileBuffer = await file.arrayBuffer();
      const fileMimeString = file.headers.get("Content-Type") ?? "";

      const textExtractor = new TextExtractor({
        arrayBuffer: fileBuffer,
        mimeType: fileMimeString,
      });

      const { error, text } = await textExtractor.extract();

      if (error) {
        throw new TRPCError({
          message: "Unsopported file type",
          code: "METHOD_NOT_SUPPORTED",
        });
      }

      const fileId = input.fileId;
      const resChunking = await chunking(text, 300, 30);

      await ctx.drizzle.insert(ctx.schema.chunks).values(
        resChunking.map((chunk) => ({
          id: crypto.randomUUID(),
          fileId: fileId,
          projectId: project.id,
          order: chunk.order,
          tokens: chunk.tokens,
          tokenLength: chunk.tokenLength,
          embedding: chunk.embedding,
          text: chunk.text,
        })),
      );

      await ctx.drizzle.insert(ctx.schema.files).values({
        projectid: project.id,
        text,
        type: fileMimeString,
        url: fileUrl,
        id: fileId,
        createdAt: new Date(),
      });
    }),

  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.externalId, input.projectId),
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
        ),
      });

      if (!project) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      const fileId = crypto.randomUUID();

      const { fields, url } = await getPresignedUrl(
        fileId,
        project.id,
        input.contentType,
      );

      return { fileId, fields, url };
    }),

  listForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.drizzle.query.projects.findFirst({
        where: ctx.helpers.and(
          ctx.helpers.eq(ctx.schema.projects.externalId, input.projectId),
          ctx.helpers.eq(ctx.schema.projects.owner, ctx.session.userId!),
        ),
      });

      if (!project) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      const files = await ctx.drizzle.query.files.findMany({
        where: ctx.helpers.eq(ctx.schema.files.projectid, project.id),
      });

      return {
        files: files.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      };
    }),
});
