import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private readonly siteKey = environment.recaptcha.siteKey;
  private scriptElement: HTMLScriptElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      if (typeof grecaptcha !== 'undefined') {
        resolve();
        return;
      }

      this.scriptElement = document.createElement('script');
      this.scriptElement.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      this.scriptElement.onload = () => resolve();
      this.scriptElement.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      document.head.appendChild(this.scriptElement);
    });
  }

  executeRecaptcha(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve('test-token');
        return;
      }

      if (typeof grecaptcha === 'undefined') {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      grecaptcha.ready(() => {
        grecaptcha.execute(this.siteKey, { action }).then((token: string) => {
          resolve(token);
        }).catch((error: any) => {
          reject(error);
        });
      });
    });
  }

  removeRecaptcha(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scriptElement && this.scriptElement.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement);
      this.scriptElement = null;
    }
    
    const recaptchaElements = document.querySelectorAll('[src*="recaptcha"], [src*="gstatic.com/recaptcha"], .grecaptcha-badge, iframe[src*="recaptcha"]');
    recaptchaElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    const recaptchaStyles = document.querySelectorAll('style[nonce], link[href*="recaptcha"]');
    recaptchaStyles.forEach(style => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
    
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      delete (window as any).grecaptcha;
    }
  }
}