import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const healthCheck = (_req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'Server is running',
  };

  res.status(200).json(response);
};
