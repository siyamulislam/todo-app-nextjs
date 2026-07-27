import { z } from "zod";
import { Priority } from "@/prisma/generated/client/enums";

const priorityValues = [
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
] as const;

export const prioritySchema = z.enum(priorityValues);

const dueDateSchema = z
  .string()
  .datetime({ offset: true, message: "dueDate must be a valid ISO-8601 datetime" })
  .transform((value) => new Date(value));

const nullableDueDateSchema = z.union([
  dueDateSchema,
  z.null(),
]);

export const createTaskSchema = z.object({
  title: z
    .string({ error: "title is required" })
    .trim()
    .min(1, "title is required")
    .max(200, "title must be at most 200 characters"),
  description: z
    .string()
    .trim()
    .max(10_000, "description must be at most 10000 characters")
    .optional()
    .nullable(),
  priority: prioritySchema.optional().default(Priority.MEDIUM),
  dueDate: dueDateSchema.optional().nullable(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "title cannot be empty")
      .max(200, "title must be at most 200 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(10_000, "description must be at most 10000 characters")
      .nullable()
      .optional(),
    completed: z.boolean().optional(),
    priority: prioritySchema.optional(),
    dueDate: nullableDueDateSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" },
  );

const booleanQuerySchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const taskQuerySchema = z.object({
  completed: booleanQuerySchema.optional(),
  priority: prioritySchema.optional(),
  search: z.string().trim().min(1).max(200).optional(),
  overdue: z
    .literal("true")
    .transform(() => true as const)
    .optional(),
});

export const taskIdSchema = z.coerce
  .number({ error: "Task id must be a number" })
  .int("Task id must be an integer")
  .positive("Task id must be a positive integer");

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
