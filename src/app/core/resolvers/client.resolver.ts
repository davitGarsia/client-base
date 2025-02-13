import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {getClientById} from '../../state/clients/client.actions';
import {selectClient} from '../../state/clients/client.selectors';
import {Client} from '../interfaces/client.interface';
import {filter, take} from 'rxjs';

export const clientResolver: ResolveFn<Client[]> = (route, state) => {
  const store: Store = inject(Store);
  const params = route.params;
  store.dispatch(getClientById({ clientId: params['id'] }));

  return store.select(selectClient).pipe(
    filter((client): client is Client[] => client !== undefined && client.length > 0), // Filter out undefined values
    take(1)
  );
};
