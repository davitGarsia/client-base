import { AbstractControl, ValidationErrors } from '@angular/forms';

export function integerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value && !/^\d+$/.test(value.toString())) {
    return { nonInteger: 'The value must be a valid integer.' };
  }

  return null;
}
