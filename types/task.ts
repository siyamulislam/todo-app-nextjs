import type { Priority, Task } from "@/prisma/generated/client/client";
import type {
  CreateTaskInput,
  TaskQueryInput,
  UpdateTaskInput,
} from "@/lib/validations/task";

/** Serializable task DTO returned by the API */
export type TaskDto = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = CreateTaskInput;
export type UpdateTaskRequest = UpdateTaskInput;
export type TaskListQuery = TaskQueryInput;

export type TaskResponse = TaskDto;
export type TaskListResponse = TaskDto[];

export type TaskIdParams = {
  id: string;
};

export function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
