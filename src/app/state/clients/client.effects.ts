import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClientActions from './client.actions';
import { ClientService } from '../../core/services/client.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ClientEffects {
  constructor(
    private actions$: Actions,
    private clientService: ClientService
  ) {}

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      mergeMap(({ params }) =>
        this.clientService.getClients(params).pipe(
          map(clients => ClientActions.loadClientsSuccess({ clients })),
          catchError(error => of(ClientActions.loadClientsFailure({ error })))
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

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      mergeMap(({ client }) =>
        this.clientService.updateClient(client).pipe(
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
