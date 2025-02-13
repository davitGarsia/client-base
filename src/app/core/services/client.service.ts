import { Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {combineLatest, Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Client} from '../interfaces/client.interface';
import {Account} from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService {
    constructor() {
    super();
  }

  getClients(params?: any): Observable<any> {
    const httpParams = new HttpParams({fromObject: params});
    return this.get('clients', httpParams);
  }

  getClientById(id: string): Observable<any> {
    return this.get(`clients/${id}`);
  }

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
    console.log('Fetching client with ID:', clientId);
    const client$: Observable<Client> = this.get(`clients/${clientId}`);

    const accounts$: Observable<Account[]> = this.get('accounts');

    return combineLatest([client$, accounts$]).pipe(
      map(([client, accounts]) => {
        if (!client) {
          throw new Error(`Client with ID ${clientId} not found.`);
        }

        const clientAccounts: Account[] = accounts.filter(account =>
          account?.clientNumber?.toString() === client?.clientNumber?.toString()
        );

        return [{...client, accounts: clientAccounts}];
      })
    );
  }
}
