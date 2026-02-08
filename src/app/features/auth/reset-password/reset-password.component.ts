import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AUTH_CONSTANTS, ROUTES } from '../../../core/constants/auth.constants';
import { RecaptchaService } from '../../../core/services/recaptcha.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentBackground = 1;
  private backgroundInterval: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly recaptchaService: RecaptchaService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit(): void {
    this.createForm();
    this.startBackgroundRotation();
    this.loadRecaptcha();
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  private createForm(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private startBackgroundRotation(): void {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, AUTH_CONSTANTS.BACKGROUND_ROTATION_INTERVAL);
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  private loadRecaptcha(): void {
    this.recaptchaService.loadRecaptcha().catch(error => {
      console.error('Erro ao carregar reCAPTCHA:', error);
      this.errorMessage = 'Erro ao carregar sistema de segurança.';
    });
  }

  private cleanupResources(): void {
    this.document.body.classList.remove('authentication-background');
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
    this.recaptchaService.removeRecaptcha();
  }

  onSubmit(): void {
    if (!this.resetForm.valid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.recaptchaService.executeRecaptcha('forgot_password')
      .then(token => {
        const payload = { email: this.resetForm.value.email };
        
        this.http.post(`${environment.apiBaseUrl}${environment.endpoints.auth.forgotPassword}`, payload)
          .pipe(
            finalize(() => this.isLoading = false),
            catchError(error => {
              this.errorMessage = error?.error?.message || 'Erro ao enviar email. Tente novamente.';
              console.error('Erro ao enviar email:', error);
              return of(null);
            })
          )
          .subscribe(response => {
            this.successMessage = 'Email de redefinição enviado com sucesso! Verifique sua caixa de entrada.';
            this.resetForm.reset();
          });
      })
      .catch(error => {
        this.isLoading = false;
        this.errorMessage = 'Erro na verificação de segurança. Tente novamente.';
        console.error('Erro no reCAPTCHA:', error);
      });
  }

  goToLogin(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }
}