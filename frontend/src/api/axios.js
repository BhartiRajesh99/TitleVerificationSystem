import axios from "axios";
import { apiUrl } from "../constants/apiURL";

const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
