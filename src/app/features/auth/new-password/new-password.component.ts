import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES, ROUTES } from '../../../core/constants/auth.constants';
import { environment } from '../../../../environments/environment';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  newPasswordForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  currentBackground = 1;
  private backgroundInterval: any;
  private token = '';
  
  readonly validationMessages = VALIDATION_MESSAGES;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.errorMessage = 'Token inválido ou expirado.';
    }
    this.createForm();
    this.startBackgroundRotation();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('authentication-background');
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
  }

  private createForm(): void {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: CustomValidators.passwordMatch('password', 'confirmPassword') });
  }

  private startBackgroundRotation(): void {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, AUTH_CONSTANTS.BACKGROUND_ROTATION_INTERVAL);
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (!this.newPasswordForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Token inválido ou expirado.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const payload = {
      token: this.token,
      novaSenha: this.newPasswordForm.value.password
    };
    
    this.http.post(`${environment.apiBaseUrl}/auth/password/reset`, payload)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError(error => {
          this.errorMessage = error?.error?.message || 'Erro ao redefinir senha. Tente novamente.';
          console.error('Erro ao redefinir senha:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        this.successMessage = 'Senha redefinida com sucesso! Redirecionando para o login...';
        this.newPasswordForm.reset();
        setTimeout(() => {
          this.router.navigate([ROUTES.LOGIN]);
        }, AUTH_CONSTANTS.SUCCESS_REDIRECT_DELAY);
      });
  }

  goToLogin(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.newPasswordForm.controls).forEach(key => {
      this.newPasswordForm.get(key)?.markAsTouched();
    });
  }
}