import type { ZodTypeAny } from "zod";
import z from "zod";

const successResponseSchema = z.object({
  success: z.literal(true),
  error: z.null(),
  data: z.unknown(),
});

const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  data: z.unknown(),
});

export const createResponseSchema = <
  T extends ZodTypeAny,
  U extends ZodTypeAny,
>({
  schemaIfSuccess,
  schemaIfError,
}: {
  schemaIfSuccess: T;
  schemaIfError: U;
}) => {
  return z.union([
    successResponseSchema.merge(z.object({ data: schemaIfSuccess })),
    errorResponseSchema.merge(z.object({ data: schemaIfError })),
  ]);
};

export type EndpointResponse = z.infer<ReturnType<typeof createResponseSchema>>;
