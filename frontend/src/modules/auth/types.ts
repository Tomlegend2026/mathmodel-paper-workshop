export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  school?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  school?: string;
  created_at: string;
  updated_at: string;
}