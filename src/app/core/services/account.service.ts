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

  addAccount(account: any) {
    return this.post('accounts', account);
  }

  closeAccount(accountId: string) {
    return this.delete(`accounts/${accountId}`);
  }


}
