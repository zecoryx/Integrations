// Custom error class for the application.
// It extends the built-in Error class and adds a status code property.
// This allows for more specific error handling based on the status code.
export class AppError extends Error {
  public readonly statusCode: number;

  // Creates a new instance of the AppError class.
//
// @param message The error message.
// @param statusCode The HTTP status code associated with the error.
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // This is necessary to make the `instanceof` operator work correctly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
