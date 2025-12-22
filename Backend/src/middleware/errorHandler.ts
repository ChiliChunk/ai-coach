import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.error('Error:', err);

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};