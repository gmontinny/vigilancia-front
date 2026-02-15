export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  email: string;
  authorities: string[];
}

export interface LoginRequest {
  email?: string;
  cpf?: string;
  senha: string;
}

export interface UserInfo {
  tokenType: string;
  email: string;
  authorities: string[];
}

export interface User {
  userId: number;
  email: string;
  authorities: string[];
}
