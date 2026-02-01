import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  private backgroundInterval: any;
  currentBackground = 1;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
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
    }, 10000);
    
    // Define background inicial
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: async (response) => {
          await this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Usuário ou senha inválidos';
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  goToResetPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/reset-password']);
  }

  goToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}