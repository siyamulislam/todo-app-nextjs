import { NextRequest } from "next/server";
import type { Prisma } from "@/prisma/generated/client/client";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { validateBody, validateSearchParams } from "@/lib/api/validate";
import {
  createTaskSchema,
  taskQuerySchema,
} from "@/lib/validations/task";
import { toTaskDto } from "@/types/task";

export async function GET(request: NextRequest) {
  try {
    const validation = validateSearchParams(
      taskQuerySchema,
      request.nextUrl.searchParams,
    );

    if (!validation.success) {
      return errorResponse("Invalid query parameters", 400, validation.details);
    }

    const { completed, priority, search, overdue } = validation.data;
    const where: Prisma.TaskWhereInput = {};

    if (typeof completed === "boolean") {
      where.completed = completed;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (overdue) {
      where.completed = false;
      where.dueDate = { lt: new Date(), not: null };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { completed: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return successResponse(tasks.map(toTaskDto));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validation = validateBody(createTaskSchema, body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400, validation.details);
    }

    const { title, description, priority, dueDate } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        priority,
        dueDate: dueDate ?? null,
      },
    });

    return successResponse(toTaskDto(task), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
