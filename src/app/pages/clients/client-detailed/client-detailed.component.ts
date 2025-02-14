import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ButtonDirective } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Account } from '../../../core/interfaces/account.interface';
import * as AccountActions from '../../../state/accounts/account.actions';
import * as ClientActions from '../../../state/clients/client.actions';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { catchError, of, switchMap, take } from 'rxjs';
import { selectClientDetailed } from '../../../state/clients/client.selectors';
import { MessageService } from 'primeng/api';
import {Tooltip} from 'primeng/tooltip';
import {DialogComponent} from '../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-client-detailed',
  standalone: true,
  imports: [
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    RouterLink,
    NgClass,
    Tooltip,
    DialogComponent
  ],
  providers: [MessageService],
  templateUrl: './client-detailed.component.html',
  styleUrl: './client-detailed.component.scss'
})
export class ClientDetailedComponent implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  dialogVisible = signal(false);
  account: WritableSignal<Account[]> = signal([]);

  totalRecords = signal(8);
  page = signal(1);
  perPage = signal(5);
  clientDetailed: WritableSignal<any> = signal([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: (data) => {
        if (data['clientDetailed']) {
          this.clientDetailed.set(data['clientDetailed']);
        }
      },
      error: (err) => {
        this.error.set('Failed to load initial client data');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load initial client data'
        });
      }
    });

    this.store.select(selectClientDetailed).pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: (data) => {
        if (data) {
          this.clientDetailed.set(data);
        }
      },
      error: (err) => {
        this.error.set('Failed to load client data from store');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load client data from store'
        });
      }
    });
  }

  pageChange(event: any) {
    const firstItemIndex = event.first;
    const rowsPerPage = event.rows;
    const currentPage = Math.floor(firstItemIndex / rowsPerPage) + 1;
    this.page.set(currentPage);
  }

  onRowChange(event: any): void {
    this.perPage.set(event);
  }

  onRowSelect(id: string): void {
  }

  closeAccount() {
    this.loading.set(true);
    this.error.set(null);

    this.actions$.pipe(
      ofType(AccountActions.closeAccount),
      switchMap(() => this.actions$.pipe(
        ofType(AccountActions.closeAccountSuccess, AccountActions.closeAccountFailure)
      )),
      switchMap((action) => {
        if (action.type === AccountActions.closeAccountFailure.type) {
          throw new Error('Failed to update account');
        }
        const clientId = this.clientDetailed()[0].id;
        this.store.dispatch(ClientActions.loadClientsDetailed({ clientId }));
        return this.store.select(selectClientDetailed);
      }),
      take(1),
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'An unexpected error occurred while closing the account'
        });
        return of(null);
      }),
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.loading.set(false);
        if (data) {
          this.clientDetailed.set(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account closed successfully'
          });
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'An unexpected error occurred');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'An unexpected error occurred while closing the account'
        });
      }
    });

    this.store.dispatch(AccountActions.closeAccount({
      account: { ...this.account()[0], accountStatus: 'closed' }
    }));
  }

  openDialog(account: Account, event: Event) {
  //  console.log('openDialog', id);
    event.stopPropagation();
    this.dialogVisible.set(true);
    this.account.set([account]);

  }

  closeDialog() {
    this.dialogVisible.set(false);
  }
}
