import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { FORM_VALIDATION } from '../../../shared/constants/theme.constants';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RecaptchaService } from '../../../core/services/recaptcha.service';
import { Usuario, CreateUsuarioRequest, SexoEnum, StatusEnum, TipoEnum } from '../../../shared/models/usuario.model';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private usuarioService: UsuarioService,
    private recaptchaService: RecaptchaService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
    this.initializeForm();
  }

  ngOnInit(): void {
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
    // Remove o reCAPTCHA quando sair do componente de cadastro
    this.recaptchaService.removeRecaptcha();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, CustomValidators.celular()]],
      sexo: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(FORM_VALIDATION.MIN_PASSWORD_LENGTH)]],
      confirmSenha: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]]
    }, { validators: CustomValidators.passwordMatch('senha', 'confirmSenha') });
  }

  private startBackgroundRotation(): void {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, FORM_VALIDATION.BACKGROUND_ROTATION_INTERVAL);
    
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

      // Executar reCAPTCHA antes de enviar o formulário
      this.recaptchaService.executeRecaptcha('register').then(token => {
        const formValue = this.registerForm.value;
        
        const usuario: Omit<Usuario, 'id'> = {
          nome: formValue.nome,
          cpf: formValue.cpf.replace(/\D/g, ''), // Remove formatação
          email: formValue.email,
          celular: formValue.celular.replace(/\D/g, ''), // Remove formatação
          senha: formValue.senha,
          sexo: parseInt(formValue.sexo),
          status: StatusEnum.INATIVO, // Fixo como inativo
          tipo: TipoEnum.EM_AVALIACAO, // Fixo como em avaliação
          imagem: '' // Será preenchido pelo backend
        };

        const request: CreateUsuarioRequest = {
          usuario,
          imagem: this.selectedImage || undefined,
          recaptchaToken: token
        };

        this.usuarioService.create(request).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
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
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  goToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}