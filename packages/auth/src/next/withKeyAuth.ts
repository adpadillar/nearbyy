import type { NextRequest } from "next/server";
import type { z, ZodNull, ZodTypeAny } from "zod";

import { paramsToObject, validateKey } from "../utils";

export const withKeyAuth = <
  BodySchema extends ZodTypeAny = ZodNull,
  ParamsSchema extends ZodTypeAny = ZodNull,
  ResponseSchema extends ZodTypeAny = ZodNull,
>(opts: {
  handler: (ctx: {
    req: NextRequest;
    projectid: string;
    body: z.infer<BodySchema>;
    params: z.infer<ParamsSchema>;
  }) =>
    | { status: number; body: z.infer<ResponseSchema> }
    | Promise<{ status: number; body: z.infer<ResponseSchema> }>;
  schema?: {
    body?: BodySchema;
    params?: ParamsSchema;
    response?: ResponseSchema;
  };
}) => {
  const { handler, schema } = opts;

  return async (req: NextRequest) => {
    // First, get the authentication token from the request headers
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    // If the token is missing
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized\nNo token provided. Please provide a valid one",
          data: null,
        }),
        { status: 401 },
      );
    }

    // If token was provided, validate it
    const { valid, projectid } = await validateKey(token);

    // If the token is invalid
    if (!valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized\nInvalid token. Please provide a valid one",
          data: null,
        }),
        { status: 401 },
      );
    }

    // If the token is valid, we can continue
    if (schema) {
      let body: z.infer<BodySchema> = null;
      if (schema.body) {
        try {
          body = (await req.json()) as unknown;
          schema.body.parse(body);
        } catch (e) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Bad request\nInvalid body",
              data: null,
            }),
            { status: 400 },
          );
        }
      }

      let params: z.infer<ParamsSchema> = null;
      if (schema.params) {
        const paramsObject = paramsToObject(req.nextUrl.searchParams);
        const parsedParams = schema.params.safeParse(paramsObject);

        if (!parsedParams.success) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Bad request\nInvalid params",
              data: null,
            }),
            {
              status: 400,
            },
          );
        }

        params = parsedParams.data as unknown;
      }

      const handlerResponse = await handler({
        req,
        body,
        params,
        projectid,
      });

      return new Response(JSON.stringify(handlerResponse.body), {
        status: handlerResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // dont parse body or params
      const handlerResponse = await handler({
        req,
        body: null,
        params: null,
        projectid,
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
