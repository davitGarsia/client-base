import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import {inject, Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/interfaces/client.interface';

@Injectable({ providedIn: 'root' })
export class UniqueClientNumberValidator implements AsyncValidator {
  clientService: ClientService = inject(ClientService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.length < 5) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap(value => this.clientService.getClients().pipe(
        map(clients =>
          clients.some((client: Client) => client.clientNumber === value)
            ? { clientNumberTaken: true }
            : null
        ),
        catchError(() => of(null))
      ))
    );
  }
}
