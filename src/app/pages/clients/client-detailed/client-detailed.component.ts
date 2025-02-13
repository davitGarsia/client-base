import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {Client} from '../../../core/interfaces/client.interface';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
export class ClientDetailedComponent implements OnInit {

  destroy$: DestroyRef = inject(DestroyRef);
  route: ActivatedRoute = inject(ActivatedRoute);

  totalRecords = signal(8);
  page = signal(1);
  perPage = signal(5);
  clientDetailed = signal([]);

  ngOnInit() {
    this.route.data.pipe(takeUntilDestroyed(this.destroy$)).subscribe(data => {
      if (data['clientDetailed']) {
        console.log(data['clientDetailed']);
        this.clientDetailed.set(data['clientDetailed']);

      }
    });
  }

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
