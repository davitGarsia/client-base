import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, map } from 'rxjs/operators';
import {loadAccounts} from '../../state/accounts/account.actions';
import {selectAccounts} from '../../state/accounts/account.selectors';

export const accountsResolver: ResolveFn<boolean> = (route, state) => {
  const store: Store = inject(Store);

  store.dispatch(loadAccounts());

  return store.select(selectAccounts).pipe(
    filter(accounts => !!accounts),
    map(accounts => accounts.length > 0),
    take(1)
  );
};
