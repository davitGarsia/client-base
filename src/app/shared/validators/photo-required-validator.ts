import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function photoRequiredValidator(isEditMode: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEditMode && !control.value) {
      // If in edit mode and photo is deleted (null or empty), return error
      return { photoRequired: true };
    }
    return null;
  };
}
