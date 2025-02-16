import { Routes } from '@angular/router';
import {clientsResolver} from './core/resolvers/clients.resolver';
import {clientResolver} from './core/resolvers/client.resolver';
import {clientDetailedResolver} from './core/resolvers/client-detailed.resolver';
import {alwaysAllowGuard} from './core/guards/mock.guard';

const CLIENT_ROUTES = {
  LIST: 'clients',
  ADD: 'add',
  EDIT: 'edit',
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
        canActivate: [alwaysAllowGuard],
        resolve: { clients: clientsResolver }
      },
      {
        path: CLIENT_ROUTES.ADD,
        loadComponent: COMPONENTS.form,
        canActivate: [alwaysAllowGuard],
      },
      {
        path: `${CLIENT_ROUTES.EDIT}/:id`,
        loadComponent: COMPONENTS.form,
        canActivate: [alwaysAllowGuard],
        resolve: {client: clientResolver}
      },
      {
        path: `${CLIENT_ROUTES.DETAIL}/:id`,
        loadComponent: COMPONENTS.detailed,
        canActivate: [alwaysAllowGuard],
        resolve: {clientDetailed: clientDetailedResolver}
      },

      {
        path: `${CLIENT_ROUTES.ADD}/${CLIENT_ROUTES.ACCOUNT}/:clientNumber`,
        canActivate: [alwaysAllowGuard],
        loadComponent: COMPONENTS.account
      },

      {
        path: `${CLIENT_ROUTES.EDIT}/${CLIENT_ROUTES.ACCOUNT}/:id`,
        canActivate: [alwaysAllowGuard],
        loadComponent: COMPONENTS.account,
        resolve: {clientDetailed: clientDetailedResolver}
      }

    ]
  },

];
