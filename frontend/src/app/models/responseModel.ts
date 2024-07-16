export interface SuccessResponse<T> {
  success: true;
  data: T;
}

// Interface for error response
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
