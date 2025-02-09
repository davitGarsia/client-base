import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  constructor() { }

  createQueryParams(filters: any): any {
    let queryParams: any = {};

    if (filters && typeof filters === 'object') {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          // Use '_like' for the filter, or directly add it
          queryParams[`${key}_like`] = value;
        }
      });
    }

    return queryParams;
  }



}
