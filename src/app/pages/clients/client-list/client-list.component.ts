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

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonDirective,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  search = new FormControl('');

  page = signal(Number(this.route.snapshot.queryParams['_page'] || 1));
  searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  clients = toSignal(this.store.select(selectClients), { initialValue: [] });

  sortField: string = this.route.snapshot.queryParams['_sort'] || 'lastName';
  sortOrder: string = this.route.snapshot.queryParams['_order'] || 'asc';
  perPage: number = Number(this.route.snapshot.queryParams['_per_page'] || 5);

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
        // If filterForm has values, clear them when search is used
        if (this.isFilterFormNotEmpty()) {
          this.filterForm.reset();
        }
        this.loadClients();
      });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        // If using filters, clear the search input
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
      this.sortField = queryParams['_sort'];
    }
    if (queryParams['_order']) {
      this.sortOrder = queryParams['_order'];
    }
    if (queryParams['_page']) {
      this.page.set(Number(queryParams['_page']));
    }
    if (queryParams['_per_page']) {
      this.perPage = Number(queryParams['_per_page']);
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

    params._page = this.page();
    params._per_page = this.perPage;
    params._sort = this.sortField;
    params._order = this.sortOrder;

    this.store.dispatch(loadClients({ params }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  nextPage(): void {
    this.page.set(this.page() + 1);
    this.loadClients();
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.loadClients();
    }
  }

  onRowSelect(id: string): void {
    this.router.navigate(['clients', 'detailed', id]);
  }

  onDeleteClient(client: Client): void {

  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.loadClients();
  }
}
