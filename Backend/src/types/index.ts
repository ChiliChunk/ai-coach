import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CustomRequest extends Request {
  user?: any;
}
