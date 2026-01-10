import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private readonly siteKey = environment.recaptcha.siteKey;
  private scriptElement: HTMLScriptElement | null = null;

  loadRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
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
    // Remove o script do reCAPTCHA
    if (this.scriptElement && this.scriptElement.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement);
      this.scriptElement = null;
    }
    
    // Remove todos os elementos do reCAPTCHA do DOM
    const recaptchaElements = document.querySelectorAll('[src*="recaptcha"], [src*="gstatic.com/recaptcha"], .grecaptcha-badge, iframe[src*="recaptcha"]');
    recaptchaElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    // Remove estilos do reCAPTCHA
    const recaptchaStyles = document.querySelectorAll('style[nonce], link[href*="recaptcha"]');
    recaptchaStyles.forEach(style => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
    
    // Remove o objeto grecaptcha do window
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      delete (window as any).grecaptcha;
    }
  }
}