import { createReducer, on } from '@ngrx/store';
import * as AccountActions from './account.actions';
import { Account} from '../../core/interfaces/account.interface';

export interface AccountState {
  accounts: Account[];
  error: any;
}

export const initialState: AccountState = {
  accounts: [],
  error: null
};

export const accountReducer = createReducer(
  initialState,
  on(AccountActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    error: null
  })),
  on(AccountActions.loadAccountsFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
