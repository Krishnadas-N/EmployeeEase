import { Response,NextFunction } from "express";

export const sendSuccessResponse = <T>(res: Response, data: T, statusCode: number = 200) => {
    res.status(statusCode).json({
      success: true,
      data
    });
  };
  
  interface ErrorResponse {
    message: string;
  }
  
  interface ErrorResponseBody {
    success: boolean;
    error: {
      message: string;
      errors?: ErrorResponse[];
    };
  }

  
  export const sendErrorResponse = (res: Response, message: string, statusCode: number = 500, formattedErrors?: ErrorResponse[]) => {
    const responseBody: ErrorResponseBody = {
      success: false,
      error: {
        message
      }
    };
  
    if (formattedErrors && formattedErrors.length > 0) {
      responseBody.error.errors = formattedErrors;
    }
  
    res.status(statusCode).json(responseBody);
  };
