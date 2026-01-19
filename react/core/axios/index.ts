import axios, { AxiosInstance } from "axios";
import { env } from "../env";
import {
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
} from "./interceptors";

// Create a new Axios instance with a custom configuration.
const api: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to the Axios instance.
// This interceptor will be executed for every outgoing request.
api.interceptors.request.use(onRequest, onRequestError);

// Add a response interceptor to the Axios instance.
// This interceptor will be executed for every incoming response.
api.interceptors.response.use(onResponse, onResponseError);

export default api;