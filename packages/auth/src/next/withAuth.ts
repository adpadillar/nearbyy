import type { NextRequest } from "next/server";
import type { z, ZodNull, ZodTypeAny } from "zod";
import { auth } from "@clerk/nextjs";

import { paramsToObject } from "../utils";

export const withAuth = <
  BodySchema extends ZodTypeAny = ZodNull,
  ParamsSchema extends ZodTypeAny = ZodNull,
  ResponseSchema extends ZodTypeAny = ZodNull,
>(opts: {
  handler: (ctx: {
    req: NextRequest;
    auth: ReturnType<typeof auth>;
    body: z.infer<BodySchema>;
    params: z.infer<ParamsSchema>;
  }) =>
    | { status: number; body: z.infer<ResponseSchema> }
    | Promise<{ status: number; body: z.infer<ResponseSchema> }>;
  schema?: {
    body?: BodySchema;
    params?: ParamsSchema;
    return?: ResponseSchema;
  };
}) => {
  const { handler, schema } = opts;

  return async (req: NextRequest) => {
    if (schema) {
      let body: z.infer<BodySchema> = null;
      if (schema.body) {
        try {
          body = (await req.json()) as unknown;
          schema.body.parse(body);
        } catch (e) {
          return new Response(
            `Bad request\nBody was missing or in the wrong format`,
            { status: 400 },
          );
        }
      }

      let params: z.infer<ParamsSchema> = null;
      if (schema.params) {
        const paramsObject = paramsToObject(req.nextUrl.searchParams);
        const parsedParams = schema.params.safeParse(paramsObject);

        if (!parsedParams.success) {
          return new Response(`Bad request\n${parsedParams.error.message}`, {
            status: 400,
          });
        }

        params = parsedParams.data as unknown;
      }

      const authCtx = auth();

      if (!authCtx.userId) {
        return new Response(
          `Unauthorized\nPlease login to access this resource`,
          { status: 401 },
        );
      }

      const handlerResponse = await handler({
        req,
        body,
        params,
        auth: authCtx,
      });

      return new Response(JSON.stringify(handlerResponse.body), {
        status: handlerResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // dont parse body or params
      const authCtx = auth();

      if (!authCtx.userId) {
        return new Response(
          `Unauthorized\nPlease login to access this resource`,
          { status: 401 },
        );
      }

      const handlerResponse = await handler({
        req,
        body: null,
        params: null,
        auth: authCtx,
      });

      return new Response(JSON.stringify(handlerResponse.body), {
        status: handlerResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };
};
