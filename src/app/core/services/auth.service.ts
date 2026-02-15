import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService, StorageType } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { AuthResponse, LoginRequest, UserInfo, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap(async (response) => {
        await this.saveAuthData(response);
        return response;
      })
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      switchMap(async (response) => {
        await this.saveAuthData(response);
        return response;
      })
    );
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`);
  }

  private async saveAuthData(response: AuthResponse): Promise<void> {
    const expiryTime = Date.now() + (response.expiresIn * 1000);
    
    await this.storageService.set(STORAGE_KEYS.AUTH_TOKEN, response.token, {
      type: StorageType.LOCAL
    });
    
    await this.storageService.set(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime, {
      type: StorageType.LOCAL
    });
    
    await this.storageService.set(STORAGE_KEYS.USER_DATA, {
      userId: response.userId,
      email: response.email,
      authorities: response.authorities
    }, {
      type: StorageType.INDEXED_DB
    });
  }

  async logout(): Promise<void> {
    await this.storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
    await this.storageService.remove(STORAGE_KEYS.TOKEN_EXPIRY);
    await this.storageService.remove(STORAGE_KEYS.USER_DATA, StorageType.INDEXED_DB);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    const expiry = await this.storageService.get<number>(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return false;

    return Date.now() < expiry;
  }

  async getToken(): Promise<string | null> {
    return await this.storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async getUserData(): Promise<User | null> {
    return await this.storageService.get(STORAGE_KEYS.USER_DATA, StorageType.INDEXED_DB);
  }

  async shouldRefreshToken(): Promise<boolean> {
    const expiry = await this.storageService.get<number>(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return false;

    const timeUntilExpiry = expiry - Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0;
  }

  preCadastro(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/pre-cadastro`, formData);
  }
}