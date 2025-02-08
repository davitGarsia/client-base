import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {selectClients} from '../../../state/clients/client.selectors';
import {loadClients} from '../../../state/clients/client.actions';
import {Store} from '@ngrx/store';

import {Client} from '../../../core/interfaces/client.interface';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-client-list',
  imports: [
    NgForOf
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit{
  private store = inject(Store);

  ngOnInit() {
    this.loadClients();
  }

  clients = toSignal(this.store.select(selectClients));

  constructor() {
    // Effect to reload clients whenever parameters change
    effect(() => {
      this.loadClients();
    });
  }

  loadClients() {
    //const params = { filter: this.filter(), page: this.page() };
    this.store.dispatch(loadClients());
    // Update URL query parameters (merging with any existing ones)
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: params,
    //   queryParamsHandling: 'merge'
    // });
  }

}
