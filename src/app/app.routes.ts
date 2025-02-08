import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/client-list/client-list.component').then(m => m.ClientListComponent)
  },
  {
    path: 'clients/add',
    loadComponent: () => import('./pages/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
  },
  {
    path: 'clients/detailed',
    loadComponent: () => import('./pages/clients/client-detailed/client-detailed.component').then(m => m.ClientDetailedComponent)
  },
  {
    path: 'clients/add/account',
    loadComponent: () => import('./pages/clients/account-form/account-form.component').then(m => m.AccountFormComponent)
  }
];
