import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';

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
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.body.classList.add('authentication-background');
  }

  ngOnInit() {
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
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  startBackgroundRotation() {
    this.backgroundInterval = setInterval(() => {
      this.currentBackground = this.currentBackground === 1 ? 2 : 1;
      this.document.body.style.backgroundImage = `url('/assets/images/background-0${this.currentBackground}.png')`;
    }, 10000);
    
    this.document.body.style.backgroundImage = `url('/assets/images/background-01.png')`;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Email de redefinição enviado com sucesso!';
      }, 2000);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}