const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('joblog_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { ...getAuthHeaders(), ...options.headers },
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem('joblog_token');
    window.location.reload();
    return;
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function getApplications() {
  return request('/applications/');
}

export function getApplication(id) {
  return request(`/applications/${id}`);
}

export function createApplication(data) {
  return request('/applications/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateApplication(id, data) {
  return request(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteApplication(id) {
  return request(`/applications/${id}`, {
    method: 'DELETE',
  });
}
