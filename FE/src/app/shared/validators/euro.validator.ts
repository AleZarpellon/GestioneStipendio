import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function euroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) return null; // Permetti 0
    const num = Number(control.value);
    return Number.isNaN(num) ? { invalidNumber: true } : null;
  };
}

export function positiveEuroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) return null; // Permetti 0
    const num = Number(control.value);
    if (Number.isNaN(num)) return { invalidNumber: true };
    if (num < 0) return { negativeNumber: true };
    return null;
  };
}

export function positiveIntValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) return null; // Permetti 0
    const num = Number(control.value);
    if (Number.isNaN(num)) return { invalidNumber: true };
    if (!Number.isInteger(num)) return { notInteger: true };
    if (num < 0) return { negativeNumber: true };
    return null;
  };
}
