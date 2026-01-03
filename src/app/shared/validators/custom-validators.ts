import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      
      if (confirmPassword.hasError('passwordMismatch')) {
        delete confirmPassword.errors!['passwordMismatch'];
        if (Object.keys(confirmPassword.errors!).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      
      return null;
    };
  }

  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const cpf = control.value.replace(/\D/g, '');
      
      if (cpf.length !== 11) {
        return { cpf: true };
      }
      
      if (/^(\d)\1{10}$/.test(cpf)) {
        return { cpf: true };
      }
      
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(9))) return { cpf: true };
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(10))) return { cpf: true };
      
      return null;
    };
  }

  static celular(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const celular = control.value.replace(/\D/g, '');
      
      if (celular.length !== 11) {
        return { celular: true };
      }
      
      if (celular.charAt(2) !== '9') {
        return { celular: true };
      }
      
      return null;
    };
  }
}