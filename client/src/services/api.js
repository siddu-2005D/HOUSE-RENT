import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject Authorization Token into Request Headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle token expirations or common error flows
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials on invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect or let AuthContext handle it
    }
    return Promise.reject(error);
  }
);

export default API;
