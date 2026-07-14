import axios from 'axios';

const TOKEN_KEY = 'kb_token';

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
}

export function setToken(token, rememberMe = false) {
  // Always clear both locations first.
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);

  if (!token) {
    return;
  }

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.request) {
    return 'Network error. Please check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5050/api',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      setToken(null);

      window.dispatchEvent(
        new Event('kb:unauthorized')
      );
    }

    return Promise.reject(error);
  }
);

export default api;