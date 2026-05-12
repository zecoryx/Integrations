import {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { AppError } from "../errors/AppError";

// Request interceptor: Executed before each request is sent.
export const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // Authentication tokens should be handled securely, e.g., via HttpOnly cookies
  // or short-lived tokens in memory.
  return config;
};

// Request error interceptor: Executed when a request fails to send.
export const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // Minimal logging to avoid leaking request details
  console.error("Network or Request setup error");
  return Promise.reject(error);
};

// Response interceptor: Executed for successful responses.
export const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// Response error interceptor: Executed for failed responses.
export const onResponseError = (error: AxiosError): Promise<AppError> => {
  if (error.response) {
    // SECURITY: Do NOT log the full 'error.response.data' to the console in production.
    // It might contain sensitive system info or user data.
    const statusCode = error.response.status;
    const errorData = error.response.data as any;
    
    const userFriendlyMessage = statusCode === 401 
      ? "Session expired. Please log in again."
      : errorData.message || "An unexpected error occurred.";

    return Promise.reject(
      new AppError(userFriendlyMessage, statusCode)
    );
  } else if (error.request) {
    return Promise.reject(
      new AppError("Network error. Please check your internet connection.", 0)
    );
  } else {
    return Promise.reject(new AppError("An unexpected error occurred.", -1));
  }
};
