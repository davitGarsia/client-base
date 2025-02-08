import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from './account.reducer';

export const selectAccountState = createFeatureSelector<AccountState>('accounts');

export const selectAccounts = createSelector(
  selectAccountState,
  state => state.accounts
);

export const selectAccountError = createSelector(
  selectAccountState,
  state => state.error
);
