
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const handleSupabaseError = (error: any): AppError => {
  console.error('Supabase error:', error);

  if (error?.code === 'PGRST116') {
    return new AppError('No data found', 'NOT_FOUND', 404);
  }

  if (error?.code === '23505') {
    return new AppError('Resource already exists', 'DUPLICATE_RESOURCE', 409);
  }

  if (error?.code === '42501') {
    return new AppError('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS', 403);
  }

  if (error?.message?.includes('JWT')) {
    return new AppError('Authentication required', 'AUTH_REQUIRED', 401);
  }

  return new AppError(
    error?.message || 'Database operation failed',
    error?.code || 'DATABASE_ERROR',
    500
  );
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw handleSupabaseError(error);
    }
  };
};
