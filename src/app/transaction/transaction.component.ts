import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'transaction', title: 'Transaction' },
        { field: 'day', title: 'Day' },
        { field: 'amount', title: 'Amount' },
        { field: 'isActive', title: 'Status' },
    ];

    transactions =[
        { id: 1, transaction: "#TX1001", day: "2025-08-01", amount: 320.50, isActive: "Success" },
        { id: 2, transaction: "#TX1002", day: "2025-08-02", amount: 450.00, isActive: "Pending" },
        { id: 3, transaction: "#TX1003", day: "2025-08-03", amount: 280.75, isActive: "Success" },
        { id: 4, transaction: "#TX1004", day: "2025-08-04", amount: 610.20, isActive: "Failed" },
        { id: 5, transaction: "#TX1005", day: "2025-08-05", amount: 150.00, isActive: "Success" },
        { id: 6, transaction: "#TX1006", day: "2025-08-06", amount: 720.90, isActive: "Pending" },
        { id: 7, transaction: "#TX1007", day: "2025-08-07", amount: 430.40, isActive: "Success" },
        { id: 8, transaction: "#TX1008", day: "2025-08-08", amount: 395.00, isActive: "Success" },
        { id: 9, transaction: "#TX1009", day: "2025-08-09", amount: 515.75, isActive: "Pending" },
        { id: 10, transaction: "#TX1010", day: "2025-08-10", amount: 275.30, isActive: "Success" },
        { id: 11, transaction: "#TX1011", day: "2025-08-11", amount: 690.00, isActive: "Failed" },
        { id: 12, transaction: "#TX1012", day: "2025-08-12", amount: 820.10, isActive: "Success" },
        { id: 13, transaction: "#TX1013", day: "2025-08-13", amount: 360.60, isActive: "Pending" },
        { id: 14, transaction: "#TX1014", day: "2025-08-14", amount: 580.90, isActive: "Success" },
        { id: 15, transaction: "#TX1015", day: "2025-08-15", amount: 440.25, isActive: "Success" },
        { id: 16, transaction: "#TX1016", day: "2025-08-16", amount: 710.70, isActive: "Failed" },
        { id: 17, transaction: "#TX1017", day: "2025-08-17", amount: 335.80, isActive: "Pending" },
    ];
}
