import http from '../../shared/api/http';
import type { LoginData, RegisterData, User } from './types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
}

export async function login(data: LoginData): Promise<LoginResponse> {
  return await http.post('/auth/login', data);
}

export async function register(data: RegisterData): Promise<User> {
  return await http.post('/auth/register', data);
}

export async function getCurrentUser(): Promise<User> {
  return await http.get('/auth/me');
}