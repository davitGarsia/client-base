import { createAction, props } from '@ngrx/store';
import {Client, ClientDetailed} from '../../core/interfaces/client.interface';


 export const loadClients = createAction(
  '[Client] Load Clients',
  props<{ params: any }>()
);

 export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{ clients: Client[] }>()
);

 export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: any }>()
);

 export const loadClientsDetailed = createAction(
  '[Client] Load Clients Detailed',
  props<{ clientId: string }>()
 )

  export const loadClientsDetailedSuccess = createAction(
    '[Client] Load Clients Detailed Success',
    props<{ clientDetailed: ClientDetailed[] }>()
  );

  export const loadClientsDetailedFailure = createAction(
    '[Client] Load Clients Detailed Failure',
    props<{ error: any }>()
  );

 export const getClientById = createAction(
  '[Client] Get Client By Id',
  props<{ clientId: string }>()
 )

  export const getClientByIdSuccess = createAction(
    '[Client] Get Client By Id Success',
    props<{ client: Client }>()
  );

  export const getClientByIdFailure = createAction(
    '[Client] Get Client By Id Failure',
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
  props<{ client: Client, clientId: string }>()
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
  props<{ clientId: string }>()
);

 export const deleteClientSuccess = createAction(
  '[Client] Delete Client Success',
  props<{ clientId: string }>()
);

 export const deleteClientFailure = createAction(
  '[Client] Delete Client Failure',
  props<{ error: any }>()
);
