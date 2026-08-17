import type { LoginResponse, AuthCredentials } from '../types';

type LoginResult = LoginResponse;

export async function login(
  credentials: AuthCredentials,
): Promise<LoginResult> {
  const body = new URLSearchParams();

  body.set('username', credentials.username);
  body.set('password', credentials.password);

  const response = await fetch('http://127.0.0.1:8000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || 'Не удалось выполнить вход');
  }

  return data;
}