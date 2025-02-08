export interface AccountForm {
  clientNumber: number | null;
  account: Account[];
}

export interface Account {
  id: number | null;
  accountNumber: number | null;
  accountType: string | null;
  currency: string | null;
  accountStatus: string | null;
}
