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

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.addAccount),
      mergeMap((action) =>
        this.accountService.addAccount(action.account).pipe(
          map((account: any) => AccountActions.addAccountSuccess({ account })),
          catchError(error => of(AccountActions.addAccountFailure({ error })))
        )
      )
    )
  );

  closeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.closeAccount),
      mergeMap((action) =>
        this.accountService.closeAccount(action.accountId).pipe(
          map(() => AccountActions.closeAccountSuccess({ accountId: action.accountId })),
          catchError(error => of(AccountActions.closeAccountFailure({ error })))
        )
      )
    )
  );
}
