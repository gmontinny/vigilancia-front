import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_token';
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulação - substituir por chamada HTTP real
    if (credentials.username === 'admin' && credentials.password === '123456') {
      const response: LoginResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', username: credentials.username }
      };
      return of(response).pipe(delay(1500));
    }
    throw new Error('Credenciais inválidas');
  }

  preCadastro(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/pre-cadastro`, formData);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
  }
}