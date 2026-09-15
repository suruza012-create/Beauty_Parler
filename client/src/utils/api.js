const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiGet = async (path) => {
  return apiRequest(path, { method: 'GET' });
};

export const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = localStorage.getItem('clientToken');
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to load data');
  }

  return payload;
};

export const apiPost = (path, body) => apiRequest(path, {
  method: 'POST',
  body: JSON.stringify(body)
});
