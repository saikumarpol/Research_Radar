import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (process.env.NODE_ENV !== "production" && !API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not configured.");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;