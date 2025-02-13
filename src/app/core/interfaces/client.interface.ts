import {Account} from './account.interface';

export interface Address {
  country: string;
  city: string;
  address: string;
}

export interface Client {
  id?: number;
  clientNumber: string;
  name: string;
  lastName: string;
  gender: string;
  personalNumber: string;
  phone: string;
  legalAddress: Address;
  factualAddress: Address;
  photo?: string | File;
}

export interface ClientDetailed extends Client {
  accounts: Account[];

}

export interface ClientState {
  clients: Client[];
  client?: Client[];
  clientDetailed?: ClientDetailed[];
  error: any;
}
