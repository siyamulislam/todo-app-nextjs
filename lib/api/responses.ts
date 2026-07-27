import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiSuccessBody } from "@/types/api";

export function successResponse<T>(
  data: T,
  status: number = 200,
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function successMessageResponse(
  status: number = 200,
): NextResponse<{ success: true }> {
  return NextResponse.json({ success: true }, { status });
}

export function errorResponse(
  error: string,
  status: number,
  details?: unknown,
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    success: false,
    error,
  };

  if (details !== undefined) {
    body.details = details;
  }

  return NextResponse.json(body, { status });
}
