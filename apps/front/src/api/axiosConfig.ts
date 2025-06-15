import axios from "axios";

/**
 * Configuração do axios com interceptadores para adicionar o token de autenticação e lidar com a atualização do token.
 */
const axiosInstance = axios.create({
  baseURL: process.env.API_END_POINT,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
