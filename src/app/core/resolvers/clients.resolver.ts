import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadClients } from '../../state/clients/client.actions';
import { selectClients } from '../../state/clients/client.selectors';
import { filter, map, take } from 'rxjs';

export const clientsResolver: ResolveFn<boolean> = (route, state) => {
  const store: Store = inject(Store);
  const params = route.queryParams;
  store.dispatch(loadClients());

  return store.select(selectClients).pipe(
    filter(clients => clients !== undefined),
    map(clients => clients.length > 0),
    take(1)
  );
};
