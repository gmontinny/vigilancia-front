import { Injectable } from '@angular/core';
import { StorageService, StorageType } from './storage.service';
import { STORAGE_KEYS, STORAGE_TTL } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class FormDraftService {
  constructor(private storageService: StorageService) {}

  async saveDraft(formName: string, formData: any): Promise<void> {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    await this.storageService.set(key, formData, {
      type: StorageType.LOCAL,
      ttl: STORAGE_TTL.ONE_DAY
    });
  }

  async getDraft(formName: string): Promise<any> {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    return await this.storageService.get(key, StorageType.LOCAL);
  }

  async removeDraft(formName: string): Promise<void> {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    await this.storageService.remove(key, StorageType.LOCAL);
  }

  async hasDraft(formName: string): Promise<boolean> {
    const draft = await this.getDraft(formName);
    return draft !== null;
  }
}
