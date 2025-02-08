export interface Address {
  country: string;
  city: string;
  address: string;
}

export interface Client {
  id?: string,
  clientNumber: number;
  name: string;
  lastName: string;
  gender: string;
  personalNumber: string;
  phone: string;
  officialAddress: Address;
  factualAddress: Address;
  photo?: string | File;
}
