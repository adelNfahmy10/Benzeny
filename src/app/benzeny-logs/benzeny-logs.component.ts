import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';
import { LogsService } from '../service/logs/logs.service';

@Component({
  selector: 'app-benzeny-logs',
  standalone: true,
  imports: [DataTableModule, FormsModule, IconModule, ReactiveFormsModule],
  templateUrl: './benzeny-logs.component.html',
  styleUrl: './benzeny-logs.component.css'
})
export class BenzenyLogsComponent {
 private readonly _LogsService = inject(LogsService);

  allLogs: WritableSignal<any[]> = signal([]);
  totalLogsCount: WritableSignal<number> = signal(0);
  pageSize: WritableSignal<number> = signal(20);
  pageNumber: WritableSignal<number> = signal(1);

  searchTerm: WritableSignal<string> = signal('');
  dateFrom: WritableSignal<string> = signal('');
  dateTo: WritableSignal<string> = signal('');

  cols = [
    { field: 'id', title: 'ID' },
    { field: 'performedBy', title: 'Performed By' },
    { field: 'details', title: 'Details' },
    { field: 'timestampFormatted', title: 'Active Time' },
  ];

  ngOnInit(): void {
    this.getAllLogs();
  }

  // ✅ Get All Logs
  getAllLogs(
    pageNumber: number = this.pageNumber(),
    pageSize: number = this.pageSize(),
    search: string = this.searchTerm(),
    dateFrom: string = this.dateFrom(),
    dateTo: string = this.dateTo()
  ): void {
    this._LogsService.getAllLogs(pageNumber, pageSize, search, dateFrom, dateTo).subscribe({
      next: (res) => {
        this.allLogs.set(res.data.items);
        this.totalLogsCount.set(res.data.totalCount);
        this.pageSize.set(res.data.pageSize);
        this.pageNumber.set(res.data.pageNumber);
      }
    });
  }

  // ✅ Search Handler
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageNumber.set(1);
    this.getAllLogs(1, this.pageSize(), term, this.dateFrom(), this.dateTo());
  }

  // ✅ Date Filter Handler
  onDateFilterChange(): void {
    this.pageNumber.set(1);
    this.getAllLogs(1, this.pageSize(), this.searchTerm(), this.dateFrom(), this.dateTo());
  }

  // ✅ Reset Filters
  resetFilters(): void {
    this.searchTerm.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.pageNumber.set(1);
    this.getAllLogs();
  }

  // ✅ Pagination Handlers
  onPageChangeCompany(page: number): void {
    this.pageNumber.set(page);
    this.getAllLogs(this.pageNumber(), this.pageSize(), this.searchTerm(), this.dateFrom(), this.dateTo());
  }

  onPageSizeChangeCompany(size: number): void {
    this.pageSize.set(size);
    this.pageNumber.set(1);
    this.getAllLogs(this.pageNumber(), this.pageSize(), this.searchTerm(), this.dateFrom(), this.dateTo());
  }
}
