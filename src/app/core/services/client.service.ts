import {inject, Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';
import {ParamsService} from './params.service';
import {HttpParams} from '@angular/common/http';

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



  getClient(id: number): Observable<any> {
    return this.get(`clients/${id}`);
  }

  addClient(client: any): Observable<any> {
    return this.post('clients', client);
  }

  updateClient(client: any): Observable<any> {
    return this.put(`clients/${client.id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.delete(`clients/${id}`);
  }
  //
  // checkClientNumberExists(clientNumber: string): Observable<any> {
  //   return this.get('clients');
  // }


}
