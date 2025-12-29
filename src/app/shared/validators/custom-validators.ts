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
}