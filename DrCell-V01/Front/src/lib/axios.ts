import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5015';

// Asegurarnos que la URL base termine con /
const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

// Extender la interfaz de configuración de Axios
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Agregar timeout
  timeout: 10000,
});

// Interceptor para agregar el token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Log del error para debugging
    console.error('Error en la petición:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No hay refresh token disponible');
        }

        const response = await axios.post(`${normalizedBaseURL}api/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Manejo de otros errores comunes
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error del servidor');
          break;
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error en la configuración de la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 