/**
 * Centralized error handling utilities for backend
 */
import { Response } from "express";

interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

export const handleError = (
  res: Response,
  error: unknown,
  message: string,
  statusCode: number = 500
): Response => {
  console.error(`${message}:`, error);

  const errorResponse: ErrorResponse = {
    error: message,
  };

  if (error instanceof Error) {
    errorResponse.details = error.message;
  }

  return res.status(statusCode).json(errorResponse);
};

export const handleNotFound = (
  res: Response,
  resource: string
): Response => {
  return res.status(404).json({
    error: `${resource} not found`,
  });
};

export const handleSuccess = (
  res: Response,
  data?: unknown,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: { message?: string; data?: unknown } = {};

  if (message) response.message = message;
  if (data) response.data = data;

  return res.status(statusCode).json(data || response);
};
