import axios from "axios";

export const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        console.warn("Unauthorized - user not logged in");
        // Optionally dispatch a global event or redirect if needed, 
        // but typically handled by Context/ProtectedRoute.
      }
      
      // Attempt to extract backend validation messages
      const backendMessage = err.response.data?.message || err.response.data?.error;
      if (backendMessage) {
        err.message = backendMessage;
      }
    }
    return Promise.reject(err);
  }
);