import { Routes } from '@angular/router';
import {resolve} from '@angular/compiler-cli';
import {clientsResolver} from './core/resolvers/clients.resolver';

const CLIENT_ROUTES = {
  LIST: 'clients',
  ADD: 'add',
  DETAIL: 'detailed',
  ACCOUNT: 'account'
} as const;

const COMPONENTS = {
  list: () => import('./pages/clients/client-list/client-list.component')
    .then(m => m.ClientListComponent),
  form: () => import('./pages/clients/client-form/client-form.component')
    .then(m => m.ClientFormComponent),
  detailed: () => import('./pages/clients/client-detailed/client-detailed.component')
    .then(m => m.ClientDetailedComponent),
  account: () => import('./pages/clients/account-form/account-form.component')
    .then(m => m.AccountFormComponent)
} as const;

export const routes: Routes = [
  {
    path: '',
    redirectTo: CLIENT_ROUTES.LIST,
    pathMatch: 'full'
  },
  {
    path: CLIENT_ROUTES.LIST,
    children: [
      {
        path: '',
        loadComponent: COMPONENTS.list,
        resolve: { clients: clientsResolver }
      },
      {
        path: `${CLIENT_ROUTES.ADD}/${CLIENT_ROUTES.ACCOUNT}`,
        loadComponent: COMPONENTS.account
      },
      {
        path: CLIENT_ROUTES.ADD,
        children: [
          {
            path: '',
            loadComponent: COMPONENTS.form
          },
          {
            path: ':id',
            loadComponent: COMPONENTS.form
          }
        ]
      },
      {
        path: `${CLIENT_ROUTES.DETAIL}/:id`,
        loadComponent: COMPONENTS.detailed
      }
    ]
  }
];
