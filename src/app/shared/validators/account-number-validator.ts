import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export function uniqueClientNumberValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // No validation if empty
    }

    return of(control.value).pipe(
      debounceTime(500),
    //  switchMap(value => clientService.checkClientNumberExists(value)),
      map(exists => (exists ? { clientNumberTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
