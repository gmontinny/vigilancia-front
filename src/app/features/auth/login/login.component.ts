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
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
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
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.loginForm.value.username;
      const isEmail = username.includes('@');
      
      const credentials: any = {
        senha: this.loginForm.value.password
      };

      if (isEmail) {
        credentials.email = username;
      } else {
        credentials.cpf = username;
      }

      this.authService.login(credentials).subscribe({
        next: async () => {
          this.isLoading = false;
          await this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Usuário ou senha inválidos';
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