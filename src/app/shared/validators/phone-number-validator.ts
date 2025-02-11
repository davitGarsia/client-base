import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startsWithFiveValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    console.log('value:', typeof value);

    if (typeof value === 'string' && value !== 'null' && value !== 'NaN' && value.startsWith('5')) {
      return null;
    }

    return { notStartingWithFive: true };
  };
}
