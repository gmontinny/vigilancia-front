import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES, ROUTES } from '../../../core/constants/auth.constants';

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
  private email = '';
  
  readonly validationMessages = VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.createForm();
    this.startBackgroundRotation();
  }

  ngOnDestroy() {
    this.document.body.classList.remove('authentication-background');
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
  }

  createForm() {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: CustomValidators.passwordMatch('password', 'confirmPassword') });
  }

  startBackgroundRotation() {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, AUTH_CONSTANTS.BACKGROUND_ROTATION_INTERVAL);
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Senha redefinida com sucesso!';
        setTimeout(() => {
          this.router.navigate([ROUTES.LOGIN]);
        }, AUTH_CONSTANTS.SUCCESS_REDIRECT_DELAY);
      }, AUTH_CONSTANTS.SIMULATION_DELAY);
    } else {
      this.markFormGroupTouched();
    }
  }

  goToLogin() {
    this.router.navigate([ROUTES.LOGIN]);
  }

  private markFormGroupTouched() {
    Object.keys(this.newPasswordForm.controls).forEach(key => {
      this.newPasswordForm.get(key)?.markAsTouched();
    });
  }
}