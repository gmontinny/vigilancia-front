import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES, ROUTES } from '../../../core/constants/auth.constants';
import { RecaptchaService } from '../../../core/services/recaptcha.service';
import { AuthService } from '../../../core/services/auth.service';
import { CpfMaskDirective, CelularMaskDirective } from '../../../shared/directives/mask.directive';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
  imports: [CommonModule, ReactiveFormsModule, CpfMaskDirective, CelularMaskDirective],
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
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
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

  private buildPreCadastroDTO(): PreCadastroDTO {
    const formValue = this.registerForm.value;
    return {
      nome: formValue.nome,
      cpf: formValue.cpf,
      celular: formValue.celular,
      email: formValue.email,
      sexo: parseInt(formValue.sexo),
      senha: formValue.senha,
      confirmarSenha: formValue.confirmarSenha
    };
  }

  private buildFormData(preCadastroDTO: PreCadastroDTO): FormData {
    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(preCadastroDTO)], { type: 'application/json' }));

    if (this.selectedImage) {
      formData.append('imagem', this.selectedImage);
    }

    return formData;
  }

  private handleSuccess(): void {
    this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
    setTimeout(() => {
      this.router.navigate([ROUTES.LOGIN]);
    }, AUTH_CONSTANTS.SUCCESS_REDIRECT_DELAY);
  }

  private handleError(error: any): void {
    this.errorMessage = error?.error?.message || 'Erro ao criar conta. Tente novamente.';
    console.error('Erro no cadastro:', error);
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
    if (!this.registerForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.recaptchaService.executeRecaptcha('register')
      .then(token => {
        const preCadastroDTO = this.buildPreCadastroDTO();
        const formData = this.buildFormData(preCadastroDTO);

        this.authService.preCadastro(formData)
          .pipe(
            finalize(() => this.isLoading = false),
            catchError(error => {
              this.handleError(error);
              return of(null);
            })
          )
          .subscribe(response => {
            if (response) {
              this.handleSuccess();
            }
          });
      })
      .catch(error => {
        this.isLoading = false;
        this.errorMessage = 'Erro na verificação de segurança. Tente novamente.';
        console.error('Erro no reCAPTCHA:', error);
      });
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
