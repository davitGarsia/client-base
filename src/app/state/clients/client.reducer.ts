import { createReducer, on } from '@ngrx/store';
import * as ClientActions from './client.actions';
import {ClientState} from '../../core/interfaces/client.interface';

export const initialState: ClientState = {
  clients: [],
  client: [],
  clientDetailed: [],
  error: null,
};

export const clientReducer = createReducer(
  initialState,
  on(ClientActions.loadClients, state => ({
    ...state,
    loading: true,
    error: null  // Reset error when fetching
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    error: null
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(ClientActions.loadClientsDetailed, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ClientActions.loadClientsDetailedSuccess, (state, { clientDetailed }) => ({
    ...state,
    clientDetailed,
    error: null
  })),

  on(ClientActions.loadClientsDetailedFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(ClientActions.getClientById, state => ({
    ...state,
    loading: true,
    error: null  // Reset error when fetching
  })),

  on(ClientActions.getClientByIdSuccess, (state, { client }) => ({
    ...state,
    client: Array.isArray(state.client) ? [...state.client, client] : [client], // Ensure it's an array before pushing
    error: null
  })),

  on(ClientActions.getClientByIdFailure, (state, { error }) => ({
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
    clients: [...state.clients.filter(c => c.id?.toString() !== clientId)],
    error: null
  })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
