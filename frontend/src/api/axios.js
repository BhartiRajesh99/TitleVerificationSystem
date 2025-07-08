import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
