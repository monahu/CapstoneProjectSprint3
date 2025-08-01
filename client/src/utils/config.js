export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};