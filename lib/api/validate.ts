import { ZodError, type ZodType } from "zod";

export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFailure = {
  success: false;
  details: ReturnType<ZodError["flatten"]>;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateBody<T>(
  schema: ZodType<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      details: result.error.flatten(),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function validateSearchParams<T>(
  schema: ZodType<T>,
  searchParams: URLSearchParams,
): ValidationResult<T> {
  const raw: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    if (value !== "") {
      raw[key] = value;
    }
  }

  return validateBody(schema, raw);
}
