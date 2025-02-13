import {inject, Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {combineLatest, Observable} from 'rxjs';
import {ParamsService} from './params.service';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Client} from '../interfaces/client.interface';
import {Account} from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService{
  paramsService: ParamsService = inject(ParamsService);

  constructor() {
    super();
  }

  getClients(params?: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.get('clients', httpParams);
  }

  getClientById(id: string): Observable<any> {
    return this.get(`clients/${id}`);
  }

  // getClientDetailed(params?: any): Observable<any> {
  //   const httpParams = new HttpParams({ fromObject: params });
  //   return this.get('clients', {httpParams});
  // }

  addClient(client: any): Observable<any> {
    return this.post('clients', client);
  }

  updateClient(client: any, clientId: string): Observable<any> {
    return this.put(`clients/${clientId}`, client);
  }

  deleteClient(id: string): Observable<any> {
    return this.delete(`clients/${id}`);
  }

  getClientDetailed(clientId: string): Observable<any> {
    // Fetch the client by ID
    console.log('Fetching client with ID:', clientId);
    const client$: Observable<Client> = this.get(`clients/${clientId}`);

    // Fetch all accounts
    const accounts$: Observable<Account[]> = this.get('accounts');

    // Combine both observables
    return combineLatest([client$, accounts$]).pipe(
      map(([client, accounts]) => {
        if (!client) {
          throw new Error(`Client with ID ${clientId} not found.`);
        }

        // Filter accounts where account.clientNumber matches client.clientNumber
        const clientAccounts: Account[] = accounts.filter(account =>
          account?.clientNumber?.toString() === client?.clientNumber?.toString()
        );

        console.log({... client, accounts: clientAccounts});

        // Return client with their associated accounts
        return [{ ...client, accounts: clientAccounts }];
      })
    );
  }


  //
  // checkClientNumberExists(clientNumber: string): Observable<any> {
  //   return this.get('clients');
  // }


}
