import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import {inject, Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import {AccountService} from '../../core/services/account.service';

@Injectable({ providedIn: 'root' })
export class UniqueAccountNumberValidator implements AsyncValidator {
  accountService: AccountService = inject(AccountService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.length < 5) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap(value => this.accountService.getAccounts().pipe(
        map((accounts: any) =>
          accounts.some((account: any) => account.accountNumber === value)
            ? { accountNumberTaken: true }
            : null
        ),
        catchError(() => of(null))
      ))
    );
  }
}
