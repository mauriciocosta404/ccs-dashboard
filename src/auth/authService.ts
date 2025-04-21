import httpClient from '../api/httpClient';

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

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return localStorage.getItem('accessToken');
}
