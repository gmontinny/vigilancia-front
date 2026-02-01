import { Injectable } from '@angular/core';

export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session',
  INDEXED_DB = 'indexeddb'
}

export interface StorageConfig {
  type: StorageType;
  ttl?: number; // Time to live em milissegundos
  encrypt?: boolean;
}

interface StorageItem<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly DB_NAME = 'vigilancia_db';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'app_storage';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initIndexedDB();
  }

  private async initIndexedDB(): Promise<void> {
    if (typeof indexedDB === 'undefined') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });
  }

  async set<T>(key: string, value: T, config: StorageConfig = { type: StorageType.LOCAL }): Promise<void> {
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: config.ttl
    };

    const serialized = JSON.stringify(item);

    switch (config.type) {
      case StorageType.LOCAL:
        localStorage.setItem(key, serialized);
        break;
      case StorageType.SESSION:
        sessionStorage.setItem(key, serialized);
        break;
      case StorageType.INDEXED_DB:
        await this.setIndexedDB(key, item);
        break;
    }
  }

  async get<T>(key: string, type: StorageType = StorageType.LOCAL): Promise<T | null> {
    let serialized: string | null = null;

    switch (type) {
      case StorageType.LOCAL:
        serialized = localStorage.getItem(key);
        break;
      case StorageType.SESSION:
        serialized = sessionStorage.getItem(key);
        break;
      case StorageType.INDEXED_DB:
        return await this.getIndexedDB<T>(key);
    }

    if (!serialized) return null;

    try {
      const item: StorageItem<T> = JSON.parse(serialized);
      
      // Verificar TTL
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.remove(key, type);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  async remove(key: string, type: StorageType = StorageType.LOCAL): Promise<void> {
    switch (type) {
      case StorageType.LOCAL:
        localStorage.removeItem(key);
        break;
      case StorageType.SESSION:
        sessionStorage.removeItem(key);
        break;
      case StorageType.INDEXED_DB:
        await this.removeIndexedDB(key);
        break;
    }
  }

  async clear(type: StorageType = StorageType.LOCAL): Promise<void> {
    switch (type) {
      case StorageType.LOCAL:
        localStorage.clear();
        break;
      case StorageType.SESSION:
        sessionStorage.clear();
        break;
      case StorageType.INDEXED_DB:
        await this.clearIndexedDB();
        break;
    }
  }

  private async setIndexedDB<T>(key: string, item: StorageItem<T>): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) throw new Error('IndexedDB not available');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(item, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getIndexedDB<T>(key: string): Promise<T | null> {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const item: StorageItem<T> | undefined = request.result;
        if (!item) {
          resolve(null);
          return;
        }

        // Verificar TTL
        if (item.ttl && Date.now() - item.timestamp > item.ttl) {
          this.removeIndexedDB(key);
          resolve(null);
          return;
        }

        resolve(item.value);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async removeIndexedDB(key: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async clearIndexedDB(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
