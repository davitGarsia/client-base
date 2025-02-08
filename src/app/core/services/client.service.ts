import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService{

  constructor() {
    super();
  }

  getClients(params?: any): Observable<any> {
    return this.get('clients');
  }

  getClient(id: number): Observable<any> {
    return this.get(`clients/${id}`);
  }

  addClient(client: any): Observable<any> {
    return this.post('clients', client);
  }

  updateClient(client: any): Observable<any> {
    return this.put(`clients/${client.id}`, client);
  }

  deleteClient(id: string): Observable<any> {
    return this.delete(`clients/${id}`);
  }


}
