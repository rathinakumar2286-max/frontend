import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says the session is invalid, sign the user out everywhere in the app.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error) =>
  error.response?.data?.message || "Can't reach the server. Check your connection and try again.";

export default api;
