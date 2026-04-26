import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        console.warn("Unauthorized - user not logged in");
        // handle logout / redirect if needed
      }

      const backendMessage =
        err.response.data?.message || err.response.data?.error;

      if (backendMessage) {
        err.message = backendMessage;
      }
    }
    return Promise.reject(err);
  }
);
