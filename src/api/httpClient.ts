import axios, { AxiosError } from 'axios';
import { logout } from '../auth/authService';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Se o erro for 401 (não autorizado), significa que o token expirou ou é inválido
    if (error.response?.status === 401) {
      // Fazer logout (limpa o localStorage)
      logout();
      
      // Redirecionar para a página de login
      // Verificar se não estamos já na página de login para evitar loop
      if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
