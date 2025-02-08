import { createReducer, on } from '@ngrx/store';
import * as ClientActions from './client.actions';
import {Client} from '../../core/interfaces/client.interface';

export interface ClientState {
  clients: Client[];
  error: any;
}

export const initialState: ClientState = {
  clients: [],
  error: null,
};

export const clientReducer = createReducer(
  initialState,
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    error: null
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ClientActions.createClientSuccess, (state, { client }) => ({
    ...state,
    clients: [...state.clients, client],
    error: null
  })),
  on(ClientActions.createClientFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    clients: state.clients.map(c => c.id === client.id ? client : c),
    error: null
  })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ClientActions.deleteClientSuccess, (state, { clientId }) => ({
    ...state,
    clients: state.clients.filter(c => c.id !== clientId),
    error: null
  })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
