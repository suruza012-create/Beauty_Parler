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
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage = typeof payload === 'object' && payload
      ? payload.message || 'Unable to load data'
      : payload || 'Unable to load data';
    throw new Error(errorMessage);
  }

  return payload || {};
};

export const apiPost = (path, body) => apiRequest(path, {
  method: 'POST',
  body: JSON.stringify(body)
});
