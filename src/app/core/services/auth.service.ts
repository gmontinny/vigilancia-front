import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService, StorageType } from './storage.service';
import { STORAGE_KEYS, STORAGE_TTL } from '../constants/storage.constants';
import { LoginRequest, LoginResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulação - substituir por chamada HTTP real
    if (credentials.username === 'admin' && credentials.password === '123456') {
      const user: User = {
        id: 1,
        username: credentials.username,
        nome: 'Administrador',
        email: 'admin@vigilancia.com.br',
        roles: ['ADMIN']
      };
      const response: LoginResponse = {
        token: 'fake-jwt-token',
        refreshToken: 'fake-refresh-token',
        user
      };
      return of(response).pipe(
        delay(1500),
        tap(res => {
          this.setToken(res.token);
          this.setUserData(res.user);
        })
      );
    }
    throw new Error('Credenciais inválidas');
  }

  preCadastro(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/pre-cadastro`, formData);
  }

  async logout(): Promise<void> {
    await this.storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
    await this.storageService.remove(STORAGE_KEYS.USER_DATA, StorageType.INDEXED_DB);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async getToken(): Promise<string | null> {
    return await this.storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setToken(token: string): Promise<void> {
    await this.storageService.set(STORAGE_KEYS.AUTH_TOKEN, token, {
      type: StorageType.LOCAL,
      ttl: STORAGE_TTL.ONE_WEEK
    });
  }

  async getUserData(): Promise<User | null> {
    return await this.storageService.get<User>(STORAGE_KEYS.USER_DATA, StorageType.INDEXED_DB);
  }

  async setUserData(user: User): Promise<void> {
    await this.storageService.set(STORAGE_KEYS.USER_DATA, user, {
      type: StorageType.INDEXED_DB,
      ttl: STORAGE_TTL.ONE_WEEK
    });
  }
}