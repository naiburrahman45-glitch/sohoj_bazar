import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sohoj_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sohoj_token");
      localStorage.removeItem("sohoj_user");
    }
    return Promise.reject(error);
  }
);

export const apiError = (error) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors.map((x) => x.message || x.msg || String(x)).join(", ");
    }
  }
  if (error?.code === "ECONNABORTED") return "সার্ভারে সাড়া পেতে বেশি সময় লাগছে।";
  if (error?.message === "Network Error") {
    return "Backend server-এর সাথে যোগাযোগ করা যাচ্ছে না। Backend চালু আছে কি না এবং VITE_API_BASE_URL ঠিক আছে কি না দেখুন।";
  }
  return "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।";
};
