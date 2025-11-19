// lib/api.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;
