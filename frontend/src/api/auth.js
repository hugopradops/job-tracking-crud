const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function getSetupStatus() {
  const res = await fetch(`${API_URL}/auth/setup-status/`);
  if (!res.ok) throw new Error('Failed to check setup status');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || 'Invalid credentials');
  }
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || 'Registration failed');
  }
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json();
}
