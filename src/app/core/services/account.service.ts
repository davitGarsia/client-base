import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Account} from '../interfaces/account.interface';

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

  updateAccount(account: Account) {
    return this.put(`accounts/${account.id}`, account);
  }


}
