import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startsWithFiveValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (typeof value === 'string' && value.trim().startsWith('5')) {
      return null;
    }

    return { notStartingWithFive: true };
  };
}
