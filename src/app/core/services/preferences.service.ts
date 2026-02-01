import { Injectable } from '@angular/core';
import { StorageService, StorageType } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';

export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: boolean;
  autoSave?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'pt-BR',
    notifications: true,
    autoSave: true
  };

  constructor(private storageService: StorageService) {}

  async getPreferences(): Promise<UserPreferences> {
    const preferences = await this.storageService.get<UserPreferences>(
      STORAGE_KEYS.USER_PREFERENCES,
      StorageType.LOCAL
    );
    return preferences || this.defaultPreferences;
  }

  async setPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const current = await this.getPreferences();
    const updated = { ...current, ...preferences };
    await this.storageService.set(STORAGE_KEYS.USER_PREFERENCES, updated, {
      type: StorageType.LOCAL
    });
  }

  async resetPreferences(): Promise<void> {
    await this.storageService.set(STORAGE_KEYS.USER_PREFERENCES, this.defaultPreferences, {
      type: StorageType.LOCAL
    });
  }
}
