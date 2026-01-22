import {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { AppError } from "../errors/AppError";

// This function is a request interceptor. It is executed before each request is sent.
// It can be used to add headers, tokens, or other custom logic to the request.
//
// @param config The Axios request configuration.
// @returns The modified request configuration.
export const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // For example, you can add an authentication token to the headers.
  // const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
};

// This function is a request error interceptor. It is executed when a request fails.
//
// @param error The Axios error.
// @returns A rejected promise with the error.
export const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // You can log the error here or handle it in a specific way.
  console.error("Request error:", error);
  return Promise.reject(error);
};

// This function is a response interceptor. It is executed for each successful response.
//
// @param response The Axios response.
// @returns The response.
export const onResponse = (response: AxiosResponse): AxiosResponse => {
  // You can process the response data here before it is returned.
  return response;
};

// This function is a response error interceptor. It is executed when a response returns an error.
//
// @param error The Axios error.
// @returns A rejected promise with a custom AppError.
export const onResponseError = (error: AxiosError): Promise<AppError> => {
  // You can handle different types of errors here.
  // For example, you can redirect to the login page on 401 Unauthorized errors.
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response error:", error.response.data);
    const errorData = error.response.data as any;
    return Promise.reject(
      new AppError(
        errorData.message || "An unexpected error occurred.",
        error.response.status
      )
    );
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network error:", error.request);
    return Promise.reject(
      new AppError("Network error. Please check your internet connection.", 0)
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error.message);
    return Promise.reject(new AppError(error.message, -1));
  }
};
