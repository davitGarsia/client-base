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
    // Convert the plain object to HttpParams
    const queryParams = this.paramsService.createQueryParams(params || {});
    console.log('queryParams', queryParams); // Should log as { clientNumber_like: 'ss', page_like: '1' }

    // Convert queryParams to HttpParams
    let httpParams = new HttpParams();
    Object.keys(queryParams).forEach(key => {
      httpParams = httpParams.append(key, queryParams[key]);
    });

    // Now pass the HttpParams in the request
    return this.get('clients', { params: httpParams });
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
