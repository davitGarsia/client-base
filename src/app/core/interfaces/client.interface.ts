export interface Address {
  country: string;
  city: string;
  address: string;
}

export interface Client {
  id?: number;
  clientNumber: number;
  name: string;
  lastName: string;
  gender: string;
  personalNumber: string;
  phone: string;
  legalAddress: Address;
  factualAddress: Address;
  photo?: string | File;
}

export interface ClientState {
  clients: Client[];
  error: any;
}
