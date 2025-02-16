import { createAction, props } from '@ngrx/store';
import {Account} from '../../core/interfaces/account.interface';

export const loadAccounts = createAction('[Account] Load Accounts');

export const loadAccountsSuccess = createAction(
  '[Account] Load Accounts Success',
  props<{ accounts: Account[] }>()
);

export const loadAccountsFailure = createAction(
  '[Account] Load Accounts Failure',
  props<{ error: any }>()
);

export const addAccount = createAction(
  '[Account] Add Account',
  props<{ account: Account }>()
);

export const addAccountSuccess = createAction(
  '[Account] Add Account Success',
  props<{ account: Account }>()
);

export const addAccountFailure = createAction(
  '[Account] Add Account Failure',
  props<{ error: any }>()
);

export const updateAccount = createAction(
  '[Account] Update Account',
  props<{ account: any, id: string }>()
);

export const updateAccountSuccess = createAction(
  '[Account] Update Account Success',
  props<{ account: any }>()
);

export const updateAccountFailure = createAction(
  '[Account] Update Account Failure',
  props<{ error: any }>()
);

export const closeAccount = createAction(
  '[Account] Close Account',
  props<{ account: Account }>()
);

export const closeAccountSuccess = createAction(
  '[Account] Close Account Success',
  props<{ account: Account }>()
);

export const closeAccountFailure = createAction(
  '[Account] Close Account Failure',
  props<{ error: any }>()
);


