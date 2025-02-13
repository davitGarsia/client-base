import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Client } from '../../../core/interfaces/client.interface';
import { selectClients } from '../../../state/clients/client.selectors';
import { loadClients } from '../../../state/clients/client.actions';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as ClientActions from '../../../state/clients/client.actions';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonDirective,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    Tooltip,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route: ActivatedRoute = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);

  search = new FormControl('');

  page = signal(Number(this.route.snapshot.queryParams['_page'] || 1));
  searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  clients = toSignal(this.store.select(selectClients), { initialValue: [] });

  sortField = signal(this.route.snapshot.queryParams['_sort'] || 'lastName');
  sortOrder = signal(this.route.snapshot.queryParams['_order'] || 'asc');
  perPage = signal(Number(this.route.snapshot.queryParams['_per_page'] || 5));
  totalRecords = signal(8);

  filterForm!: FormGroup;

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      clientNumber: new FormControl(''),
      name: new FormControl(''),
      gender: new FormControl(''),
      personalNumber: new FormControl(''),
      phone: new FormControl(''),
      legalAddress: new FormControl(''),
      actualAddress: new FormControl(''),
    });

    this.populateFormFromQueryParams();

    if (this.searchTerm()) {
      this.search.setValue(this.searchTerm());
    }

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isFilterFormNotEmpty()) {
          this.filterForm.reset();
        }
        this.loadClients();
      });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.isFilterFormNotEmpty()) {
          console.log('Filter value changed:', value);
          this.search.setValue('', { emitEvent: false });
        }
        this.loadClients();
      });
  }

  private isFilterFormNotEmpty(): boolean {
    const filterValues = this.filterForm.value;
    return Object.values(filterValues).some(
      (val) => val && val.toString().trim() !== ''
    );
  }

  populateFormFromQueryParams(): void {
    const queryParams = this.route.snapshot.queryParams;
    const filterValues = {
      clientNumber: queryParams['clientNumber'] || '',
      name: queryParams['name'] || '',
      gender: queryParams['gender'] || '',
      personalNumber: queryParams['personalNumber'] || '',
      phone: queryParams['phone'] || '',
      legalAddress: queryParams['legalAddress'] || '',
      actualAddress: queryParams['actualAddress'] || '',
    };
    this.filterForm.patchValue(filterValues);

    if (queryParams['_sort']) {
      this.sortField.set(queryParams['_sort']);
    }
    if (queryParams['_order']) {
      this.sortOrder.set(queryParams['_order']);
    }
    if (queryParams['_page']) {
      this.page.set(Number(queryParams['_page']));
    }
    if (queryParams['_per_page']) {
      this.perPage.set(Number(queryParams['_per_page']));
    }
  }

  loadClients(): void {
    let params: any = {};

    if (this.search.value && this.search.value.trim() !== '') {
      params.search = this.search.value;
    } else {
      const filterParams = Object.entries(this.filterForm.value).reduce((acc, [key, value]) => {
        if (value && value.toString().trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      params = { ...filterParams };
    }

    // Ensure signals are converted to primitive values
    params._page = this.page();        // Ensure number
    params._per_page = this.perPage(); // Ensure number
    params._sort = this.sortField();   // Ensure string
    params._order = this.sortOrder();  // Ensure string

    this.store.dispatch(loadClients({ params }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...params }, // Ensure all values are primitives
    });
  }


  pageChange(event: any) {
    const firstItemIndex = event.first;
    const rowsPerPage = event.rows;
    const currentPage = Math.floor(firstItemIndex / rowsPerPage) + 1;

    this.page.set(currentPage);
    this.loadClients();
  }

  onRowChange(event: any): void {
    console.log(event)
    this.perPage.set(event);
    this.loadClients();
  }

  onRowSelect(id: string): void {
    this.router.navigate(['clients', 'detailed', id]);
  }

  onDeleteClient(event: any, client: Client): void {
    event.stopPropagation();
    console.log(client)

    if (client.id) {
      this.store.dispatch(ClientActions.deleteClient({ clientId: client.id.toString() }));
    }
    this.store.dispatch(loadClients({ params: {} }));
  }

  onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
    this.loadClients();
  }
}
