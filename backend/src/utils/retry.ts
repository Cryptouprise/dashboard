interface RetryOptions {
  retries?: number;
  delay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  retries: 3,
  delay: 1000,
  onRetry: () => {}
};

/**
 * Utility function to retry an async operation with exponential backoff
 * @param operation Function to retry
 * @param options Retry configuration options
 * @returns Promise that resolves with the operation result or rejects after all retries fail
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries, delay, onRetry } = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === retries) {
        break;
      }
      
      onRetry(lastError, attempt);
      
      // Wait with exponential backoff before retrying
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }
  
  throw lastError!;
}

/**
 * Utility function to retry a database operation with mongoose-specific error handling
 * @param operation Database operation to retry
 * @param options Retry configuration options
 * @returns Promise that resolves with the operation result
 */
export async function retryDbOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retryOperation(operation, {
    ...options,
    onRetry: (error, attempt) => {
      // Handle specific MongoDB error codes here if needed
      if (options.onRetry) {
        options.onRetry(error, attempt);
      }
    }
  });
} 