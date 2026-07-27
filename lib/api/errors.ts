import { ZodError } from "zod";
import { Prisma } from "@/prisma/generated/client/client";
import { errorResponse } from "@/lib/api/responses";

export function handleApiError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof ZodError) {
    return errorResponse("Validation failed", 400, error.flatten());
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return errorResponse("Task not found", 404);
    }

    if (error.code === "P2002") {
      return errorResponse("A record with this value already exists", 409);
    }

    return errorResponse("Database request failed", 400, {
      code: error.code,
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse("Invalid database query", 400);
  }

  if (error instanceof SyntaxError) {
    return errorResponse("Invalid JSON body", 400);
  }

  return errorResponse("Internal server error", 500);
}
