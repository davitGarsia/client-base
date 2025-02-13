import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {clientReducer} from './state/clients/client.reducer';
import {ClientEffects} from './state/clients/client.effects';
import {provideHttpClient} from '@angular/common/http';
import {accountReducer} from './state/accounts/account.reducer';
import {AccountEffects} from './state/accounts/account.effects';
import {providePrimeNG} from 'primeng/config';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import LaraLightBlue from '@primeng/themes/lara';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ clients: clientReducer, accounts: accountReducer }),
    provideEffects([ClientEffects, AccountEffects]),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
       preset: LaraLightBlue,
        options: {darkModeSelector: '.app-dark'}
}
    }),
    MessageService
  ]
};
