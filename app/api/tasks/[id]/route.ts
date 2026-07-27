import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api/errors";
import {
  errorResponse,
  successMessageResponse,
  successResponse,
} from "@/lib/api/responses";
import { validateBody } from "@/lib/api/validate";
import { taskIdSchema, updateTaskSchema } from "@/lib/validations/task";
import { toTaskDto } from "@/types/task";

type RouteParams = {
  params: Promise<{ id: string }>;
};

function parseTaskId(idParam: string) {
  const result = taskIdSchema.safeParse(idParam);

  if (!result.success) {
    return {
      success: false as const,
      details: result.error.flatten(),
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params;
    const idResult = parseTaskId(idParam);

    if (!idResult.success) {
      return errorResponse("Invalid task id", 400, idResult.details);
    }

    const task = await prisma.task.findUnique({
      where: { id: idResult.data },
    });

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(toTaskDto(task));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params;
    const idResult = parseTaskId(idParam);

    if (!idResult.success) {
      return errorResponse("Invalid task id", 400, idResult.details);
    }

    const body: unknown = await request.json();
    const validation = validateBody(updateTaskSchema, body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400, validation.details);
    }

    const existing = await prisma.task.findUnique({
      where: { id: idResult.data },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Task not found", 404);
    }

    const task = await prisma.task.update({
      where: { id: idResult.data },
      data: validation.data,
    });

    return successResponse(toTaskDto(task));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params;
    const idResult = parseTaskId(idParam);

    if (!idResult.success) {
      return errorResponse("Invalid task id", 400, idResult.details);
    }

    const existing = await prisma.task.findUnique({
      where: { id: idResult.data },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Task not found", 404);
    }

    await prisma.task.delete({
      where: { id: idResult.data },
    });

    return successMessageResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
