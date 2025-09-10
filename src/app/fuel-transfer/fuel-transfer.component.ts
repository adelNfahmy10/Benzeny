import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';

@Component({
  selector: 'app-fuel-transfer',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './fuel-transfer.component.html',
  styleUrl: './fuel-transfer.component.css'
})
export class FuelTransferComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'transaction', title: 'Transaction' },
        { field: 'day', title: 'Day' },
        { field: 'amount', title: 'Amount' },
    ];

    fuelTransfers = [
        { id: 1, transaction: "Fuel Transfer", day: "2025-08-01", amount: 250 },
        { id: 2, transaction: "Fuel Transfer", day: "2025-08-02", amount: 300 },
        { id: 3, transaction: "Wash Transfer", day: "2025-08-03", amount: 180 },
        { id: 4, transaction: "Fuel Transfer", day: "2025-08-04", amount: 420 },
        { id: 5, transaction: "Oil Transfer", day: "2025-08-05", amount: 500 },
        { id: 6, transaction: "Fuel Transfer", day: "2025-08-06", amount: 275 },
        { id: 7, transaction: "Wash Transfer", day: "2025-08-07", amount: 360 },
        { id: 8, transaction: "Wash Transfer", day: "2025-08-08", amount: 410 },
        { id: 9, transaction: "Fuel Transfer", day: "2025-08-09", amount: 295 },
        { id: 10, transaction: "Fuel Transfer", day: "2025-08-10", amount: 350 },
        { id: 11, transaction: "Fuel Transfer", day: "2025-08-11", amount: 400 },
        { id: 12, transaction: "Fuel Transfer", day: "2025-08-12", amount: 260 },
        { id: 13, transaction: "Fuel Transfer", day: "2025-08-13", amount: 330 },
        { id: 14, transaction: "Fuel Transfer", day: "2025-08-14", amount: 285 },
        { id: 15, transaction: "Fuel Transfer", day: "2025-08-15", amount: 370 },
        { id: 16, transaction: "Fuel Transfer", day: "2025-08-16", amount: 440 },
        { id: 17, transaction: "Fuel Transfer", day: "2025-08-17", amount: 390 },
    ];
}
