import {Component, signal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {Client} from '../../../core/interfaces/client.interface';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-client-detailed',
  imports: [
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './client-detailed.component.html',
  styleUrl: './client-detailed.component.scss'
})
export class ClientDetailedComponent {

  totalRecords = signal(8);
  page = signal(1);
  perPage = signal(5);
  clients = signal([
    {
      id: '1',
      clientNumber: '123',
      name: 'John Doe',
      gender: 'male',
      personalNumber: '123456-78901',
      phone: '123456789',
      legalAddress: '123 Main St',
      actualAddress: '123 Main St'
    }
  ]);

  pageChange(event: any) {
    const firstItemIndex = event.first;
    const rowsPerPage = event.rows;
    const currentPage = Math.floor(firstItemIndex / rowsPerPage) + 1;

    // this.page.set(currentPage);
    // this.loadClients();
  }

  onRowChange(event: any): void {
    console.log(event)
    // this.perPage.set(event);
    // this.loadClients();
  }

  onRowSelect(id: string): void {
   // this.router.navigate(['clients', 'detailed', id]);
  }



}
