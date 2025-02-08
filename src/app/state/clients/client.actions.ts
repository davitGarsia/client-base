import { createAction, props } from '@ngrx/store';
import {Client} from '../../core/interfaces/client.interface';


 export const loadClients = createAction(
  '[Client] Load Clients',
);

 export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{ clients: Client[] }>()
);

 export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: any }>()
);


 export const createClient = createAction(
  '[Client] Create Client',
  props<{ client: Partial<Client> }>()
);

 export const createClientSuccess = createAction(
  '[Client] Create Client Success',
  props<{ client: Client }>()
);

 export const createClientFailure = createAction(
  '[Client] Create Client Failure',
  props<{ error: any }>()
);

 export const updateClient = createAction(
  '[Client] Update Client',
  props<{ client: Client }>()
);

 export const updateClientSuccess = createAction(
  '[Client] Update Client Success',
  props<{ client: Client }>()
);
export const updateClientFailure = createAction(
  '[Client] Update Client Failure',
  props<{ error: any }>()
);


 export const deleteClient = createAction(
  '[Client] Delete Client',
  props<{ clientId: number }>()
);

 export const deleteClientSuccess = createAction(
  '[Client] Delete Client Success',
  props<{ clientId: number }>()
);

 export const deleteClientFailure = createAction(
  '[Client] Delete Client Failure',
  props<{ error: any }>()
);
