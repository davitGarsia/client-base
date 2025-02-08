import { createFeatureSelector, createSelector } from '@ngrx/store';
import {ClientState} from '../../core/interfaces/client.interface';

export const selectClientState = createFeatureSelector<ClientState>('clients');

export const selectClients = createSelector(
  selectClientState,
  state => state.clients
);

export const selectClientError = createSelector(
  selectClientState,
  state => state.error
);
