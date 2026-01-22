import { AppError } from "./AppError";

// Handles errors in the application.
// This function can be used as a global error handler.
// It checks if the error is an instance of AppError and logs the error to the console.
// In a real-world application, this is where you would integrate with a logging service like Sentry or LogRocket.
//
// @param error The error to handle.
export const handleError = (error: Error): void => {
  if (error instanceof AppError) {
    // This is a custom application error.
    console.error(`AppError: ${error.message} (status code: ${error.statusCode})`);
  } else {
    // This is an unexpected error.
    console.error("An unexpected error occurred:", error);
  }
};
