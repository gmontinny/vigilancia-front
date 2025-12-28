import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { FORM_VALIDATION } from '../../../shared/constants/theme.constants';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private backgroundInterval: any;
  currentBackground = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
    this.resetForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(FORM_VALIDATION.MIN_PASSWORD_LENGTH)]],
      newPassword: ['', [Validators.required, Validators.minLength(FORM_VALIDATION.MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(FORM_VALIDATION.MIN_PASSWORD_LENGTH)]]
    }, { validators: CustomValidators.passwordMatch('newPassword', 'confirmPassword') });
  }

  ngOnInit(): void {
    this.startBackgroundRotation();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('authentication-background');
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
  }

  private startBackgroundRotation(): void {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, FORM_VALIDATION.BACKGROUND_ROTATION_INTERVAL);
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Senha redefinida com sucesso!';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 2000);
    }
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}