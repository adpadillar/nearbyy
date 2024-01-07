import type { ZodSchema } from "zod";

export type Maybe<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: Error };

type CanBeStringified =
  | string
  | number
  | boolean
  | null
  | undefined
  | CanBeStringified[]
  | { [key: string]: CanBeStringified };

export const typesafeFetch = async <
  Params extends Record<string, CanBeStringified>,
  Body,
  Return,
>(opts: {
  route: `/api/${string}`;
  method: "GET" | "POST";
  params?: Params;
  body?: Body;
  schema: {
    params?: ZodSchema<Params>;
    body?: ZodSchema<Body>;
    return: ZodSchema<Return>;
  };
}): Promise<Maybe<Return>> => {
  const { route, method, schema } = opts;

  let body = undefined;
  if (opts.body) {
    body = JSON.stringify(opts.body);
  }

  let params = undefined;
  if (opts.params) {
    const toStringAllValues: Record<string, string> = {};

    for (const [key, value] of Object.entries(opts.params)) {
      toStringAllValues[key] = value?.toString() ?? "";
    }

    params = new URLSearchParams(toStringAllValues).toString();
  }

  try {
    const res = await fetch(`${route}${params ? `?${params}` : ""}`, {
      method,
      body,
    });

    const json = (await res.json()) as unknown;
    const parsed = schema.return.safeParse(json);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error: new Error(parsed?.error.message),
      };
    }

    return { success: true, data: parsed.data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: new Error("Something went wrong"),
    };
  }
};
