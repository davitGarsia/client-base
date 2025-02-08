import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function georgianOrLatinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const georgianRegex = /^[\u10A0-\u10FF\s]+$/;
    const englishRegex = /^[a-zA-Z\s]+$/;

    if (georgianRegex.test(control.value) || englishRegex.test(control.value)) {
      return null;
    }

    return { mixedLanguages: true };
  };
}
