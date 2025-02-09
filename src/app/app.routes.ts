import { Routes } from '@angular/router';
import {resolve} from '@angular/compiler-cli';
import {clientsResolver} from './core/resolvers/clients.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/client-list/client-list.component').then(m => m.ClientListComponent),
    resolve: { clients: clientsResolver }
  },
  {
    path: 'clients/add',
    loadComponent: () => import('./pages/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
  },
  {
    path: 'clients/add/:id',
    loadComponent: () => import('./pages/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
  },
  {
    path: 'clients/detailed/:id',
    loadComponent: () => import('./pages/clients/client-detailed/client-detailed.component').then(m => m.ClientDetailedComponent)
  },
  {
    path: 'clients/add/account',
    loadComponent: () => import('./pages/clients/account-form/account-form.component').then(m => m.AccountFormComponent)
  }
];
