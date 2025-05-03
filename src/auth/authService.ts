import httpClient from '../api/httpClient';
import { User } from '../types/User';

export async function login(email: string, senha: string) {
  const response = await httpClient.post('/auth/login', { email, senha });
  const { accessToken, user } = response.data;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  return { accessToken, user };
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export function getUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  return localStorage.getItem('accessToken');
}