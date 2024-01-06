import type { z } from "zod";

import { apiTypes } from "~/app/api/apiTypes";

type Maybe<T> =
  | { success: true; value: T; error: null }
  | { success: false; value: null; error: Error };

export const getFromApiRoute = async <T extends keyof typeof apiTypes>(opts: {
  route: T;
  values?: {
    // @ts-expect-error This is not being inferred correctly
    // and it causes a type error, but it works fine
    params?: z.infer<(typeof apiTypes)[T]["GET"]["params"]>;
    // @ts-expect-error This is not being inferred correctly
    // and it causes a type error, but it works fine
    body?: z.infer<(typeof apiTypes)[T]["GET"]["body"]>;
  };
}): Promise<Maybe<z.infer<(typeof apiTypes)[T]["GET"]["return"]>>> => {
  const { route, values } = opts;

  let body = undefined;
  if (values?.body) {
    body = JSON.stringify(values.body);
  }

  let params = undefined;
  if (values?.params) {
    const toStringAllValues: Record<string, string> = {};

    for (const [key, value] of Object.entries(values.params)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      toStringAllValues[key] = `${value}`;
    }

    params = new URLSearchParams(toStringAllValues).toString();
  }

  try {
    const res = await fetch(`/api${route}${params ? `?${params}` : ""}`, {
      method: "GET",
      body,
    });

    const json = (await res.json()) as unknown;
    const parsed = apiTypes[route].GET.return.safeParse(json);

    if (!parsed.success) {
      return { success: false, value: null, error: parsed.error };
    }

    return { success: true, value: parsed.data, error: null };
  } catch (error) {
    return {
      success: false,
      value: null,
      error: new Error("Something went wrong"),
    };
  }
};
