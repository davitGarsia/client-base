import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClientActions from './client.actions';
import { ClientService } from '../../core/services/client.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ClientEffects {
  clientService: ClientService = inject(ClientService);
  actions$: Actions = inject(Actions);
  constructor(
  ) {
}

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      mergeMap(({ params }) =>
        this.clientService.getClients(params).pipe(
          map(response => {
            const clients = response?.data ?? response; // If response has 'data', extract it; otherwise, use response directly
            return ClientActions.loadClientsSuccess({ clients });
          }),
          catchError(error => of(ClientActions.loadClientsFailure({ error })))
        )
      )
    )
  );

  loadClientById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.getClientById),
      mergeMap(({ clientId }) =>
        this.clientService.getClientById(clientId).pipe(
          map(client => ClientActions.getClientByIdSuccess({ client })),
          catchError(error => of(ClientActions.getClientByIdFailure({ error })))
        )
      )
    )
  );


  createClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.createClient),
      mergeMap(({ client }) =>
        this.clientService.addClient(client).pipe(
          map(createdClient => ClientActions.createClientSuccess({ client: createdClient })),
          catchError(error => of(ClientActions.createClientFailure({ error })))
        )
      )
    )
  );

  loadClientDetailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClientsDetailed),
      mergeMap(({ clientId }) =>
        this.clientService.getClientDetailed(clientId).pipe(
          map(clientDetailed => ClientActions.loadClientsDetailedSuccess({ clientDetailed })),
          catchError(error => of(ClientActions.loadClientsDetailedFailure({ error })))
        )
      )
    )
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      mergeMap(({ client, clientId }) =>
        this.clientService.updateClient(client, clientId ).pipe(
          map(updatedClient => ClientActions.updateClientSuccess({ client: updatedClient })),
          catchError(error => of(ClientActions.updateClientFailure({ error })))
        )
      )
    )
  );

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      mergeMap(({ clientId }) =>
        this.clientService.deleteClient(clientId).pipe(
          map(() => ClientActions.deleteClientSuccess({ clientId })),
          catchError(error => of(ClientActions.deleteClientFailure({ error })))
        )
      )
    )
  );
}
