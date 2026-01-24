import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES, ROUTES } from '../../../core/constants/auth.constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RecaptchaService } from '../../../core/services/recaptcha.service';

interface PreCadastroDTO {
  nome: string;
  cpf: string;
  celular: string;
  email: string;
  sexo: number;
  senha: string;
  confirmarSenha: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedImage: File | null = null;
  selectedImageName = '';
  private backgroundInterval: any;
  currentBackground = 1;

  readonly validationMessages = VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private recaptchaService: RecaptchaService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit(): void {
    this.createForm();
    this.startBackgroundRotation();
    this.recaptchaService.loadRecaptcha().catch(error => {
      console.error('Erro ao carregar reCAPTCHA:', error);
    });
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('authentication-background');
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
    this.recaptchaService.removeRecaptcha();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)]],
      confirmarSenha: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]]
    }, { validators: CustomValidators.passwordMatch('senha', 'confirmarSenha') });
  }

  startBackgroundRotation(): void {
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.selectedImageName = this.selectedImage.name;
    } else {
      this.selectedImage = null;
      this.selectedImageName = '';
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.recaptchaService.executeRecaptcha('register').then(token => {
        const formData = new FormData();
        
        const preCadastroDTO: PreCadastroDTO = {
          nome: this.registerForm.value.nome,
          cpf: this.registerForm.value.cpf,
          celular: this.registerForm.value.celular,
          email: this.registerForm.value.email,
          sexo: parseInt(this.registerForm.value.sexo),
          senha: this.registerForm.value.senha,
          confirmarSenha: this.registerForm.value.confirmarSenha
        };

        formData.append('dados', new Blob([JSON.stringify(preCadastroDTO)], { type: 'application/json' }));
        
        if (this.selectedImage) {
          formData.append('imagem', this.selectedImage);
        }

        this.http.post(`${environment.apiBaseUrl}/auth/pre-cadastro`, formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
            setTimeout(() => {
              this.router.navigate([ROUTES.LOGIN]);
            }, AUTH_CONSTANTS.SUCCESS_REDIRECT_DELAY);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Erro ao criar conta. Tente novamente.';
          }
        });
      }).catch(error => {
        this.isLoading = false;
        this.errorMessage = 'Erro na verificação de segurança. Tente novamente.';
        console.error('Erro no reCAPTCHA:', error);
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate([ROUTES.LOGIN]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}