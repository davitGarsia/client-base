import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AccountActions from './account.actions';
import {AccountService} from '../../core/services/account.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AccountEffects {
  actions$: Actions = inject(Actions);
  accountService: AccountService = inject(AccountService);
  constructor(
  ) {}

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      mergeMap(() =>
        this.accountService.getAccounts().pipe(
          map((accounts: any) => AccountActions.loadAccountsSuccess({ accounts })),
          catchError(error => of(AccountActions.loadAccountsFailure({ error })))
        )
      )
    )
  );
}
