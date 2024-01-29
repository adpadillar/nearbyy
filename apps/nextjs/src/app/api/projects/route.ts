import { withAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";

import { getSchema, postSchema } from "./schema";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const POST = withAuth({
  handler: async ({ auth, body }) => {
    try {
      // We check if the project already exists
      const project = await db.drizzle.query.projects.findFirst({
        where: db.helpers.and(
          db.helpers.eq(db.schema.projects.externalId, body.id), // We check if the project id is the same
          db.helpers.eq(db.schema.projects.owner, auth.userId!), // We check if the project belongs to the user
        ),
      });

      if (project) {
        return {
          status: 400,
          body: {
            project: null,
            error: "The project already exists.",
          },
        };
      }

      // We insert the project into the database
      await db.drizzle.insert(db.schema.projects).values({
        externalId: body.id,
        id: crypto.randomUUID(),
        name: body.name,
        owner: auth.userId!,
        description: body.desciption,
      });

      // If everything went well, we return a 200 status code
      // Notice we don't return the project id, but the external id
      return {
        status: 200,
        body: {
          project: { id: body.id },
          error: null,
        },
      };
    } catch {
      // If something went wrong, we return a 500 status code
      return {
        status: 500,
        body: {
          project: null,
          error: "Something went wrong when creating the project.",
        },
      };
    }
  },
  schema: postSchema,
});

export const GET = withAuth({
  handler: async ({ auth }) => {
    try {
      // We fetch all the projects that belong to the user
      const projects = await db.drizzle
        .select({
          id: db.schema.projects.externalId,
          name: db.schema.projects.name,
        })
        .from(db.schema.projects)
        .where(db.helpers.eq(db.schema.projects.owner, auth.userId!));

      // If everything went well, we return a 200 status code
      // Notice we don't return the project id, but the external id
      return {
        status: 200,
        body: {
          projects: projects.map((p) => ({ id: p.id, name: p.name })),
          error: null,
        },
      };
    } catch {
      // If something went wrong, we return a 500 status code
      return {
        status: 500,
        body: {
          projects: [],
          error: "Something went wrong when fetching the projects.",
        },
      };
    }
  },

  schema: getSchema,
});
