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
  on(AccountActions.loadAccounts, state => ({
    ...state,
    accounts: [],
    error: null
  })),

  on(AccountActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    error: null
  })),

  on(AccountActions.loadAccountsFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AccountActions.addAccount, state => ({
    ...state,
    error: null
  })),

  on(AccountActions.addAccountSuccess, (state, { account }) => ({
    ...state,
    accounts: [...state.accounts, account],
    error: null
  })),

  on(AccountActions.addAccountFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AccountActions.updateAccount, state => ({
    ...state,
    error: null
  })),

  on(AccountActions.updateAccountSuccess, (state, { account }) => ({
    ...state,
    accounts: state.accounts.map(a => a.id === account.id ? account : a),
    error: null
  })),

  on(AccountActions.updateAccountFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AccountActions.closeAccount, state => ({
    ...state,
    error: null
  })),

  on(AccountActions.closeAccountSuccess, (state, { account }) => ({
    ...state,
    accounts: state.accounts.map(a => a.id === account.id ? account : a),
    error: null
  })),

  on(AccountActions.closeAccountFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
