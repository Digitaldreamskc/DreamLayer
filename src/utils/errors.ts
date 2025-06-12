export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded. Please try again later.') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

// Error handling utilities
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const handleError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500);
};

// Error messages
export const ErrorMessages = {
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  AUTHENTICATION_REQUIRED: 'Please connect your wallet to continue.',
  VALIDATION_FAILED: 'Invalid input. Please check your data and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;