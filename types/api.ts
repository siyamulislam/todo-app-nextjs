export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  error: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccessBody<T> | ApiErrorBody;

export type DeleteSuccessBody = {
  success: true;
};
