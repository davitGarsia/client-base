import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadClientsDetailed} from '../../state/clients/client.actions';
import {selectClientDetailed} from '../../state/clients/client.selectors';
import { filter, map, take } from 'rxjs';
import {ClientDetailed} from '../interfaces/client.interface';
import * as ClientActions from '../../state/clients/client.actions';
import {Actions, ofType} from '@ngrx/effects';

export const clientDetailedResolver: ResolveFn<ClientDetailed[]> = (route, state) => {
  const store: Store = inject(Store);
  const actions$ = inject(Actions);
  const id = route.params['id'];

  store.dispatch(loadClientsDetailed({ clientId: id }));

  return actions$.pipe(
    ofType(ClientActions.loadClientsDetailedSuccess),
    map(action => action.clientDetailed),
    take(1)
  );
};
