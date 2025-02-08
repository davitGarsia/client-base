import { Injectable } from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {

  constructor() {
    super();
  }

  getAccounts() {
    return this.get('accounts');
  }


}
