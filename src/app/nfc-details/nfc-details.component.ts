import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';

@Component({
  selector: 'app-nfc-details',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './nfc-details.component.html',
  styleUrl: './nfc-details.component.css'
})
export class NfcDetailsComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'transaction', title: 'Transaction' },
        { field: 'amount', title: 'Amount' },
        { field: 'date', title: 'Date' },
        { field: 'station', title: 'Station' },
        { field: 'status', title: 'Status' },
    ];

    transactionRow:any[] = [
        { id: 1, transaction: "Fuel Purchase", amount: 150.75, station: "Al-Faisaliah Station - Riyadh", date: "2025-08-01", status: "Success" },
        { id: 2, transaction: "Car Wash", amount: 50.00, station: "Al-Naseem Station - Jeddah", date: "2025-08-02", status: "Pending" },
        { id: 3, transaction: "Fuel Purchase", amount: 200.00, station: "Al-Malaz Station - Riyadh", date: "2025-08-03", status: "Failed" },
        { id: 4, transaction: "Fuel Purchase", amount: 175.25, station: "Al-Olaya Station - Dammam", date: "2025-08-04", status: "Success" },
        { id: 5, transaction: "Oil Change", amount: 120.50, station: "Al-Rawdah Station - Mecca", date: "2025-08-05", status: "Success" },
        { id: 6, transaction: "Fuel Purchase", amount: 90.00, station: "King Fahd Station - Medina", date: "2025-08-06", status: "Pending" },
        { id: 7, transaction: "Fuel Purchase", amount: 300.00, station: "Al-Sharq Station - Jeddah", date: "2025-08-07", status: "Success" },
        { id: 8, transaction: "Car Wash", amount: 60.00, station: "Al-Safa Station - Riyadh", date: "2025-08-08", status: "Failed" },
        { id: 9, transaction: "Fuel Purchase", amount: 220.00, station: "Al-Batha Station - Dammam", date: "2025-08-09", status: "Success" },
        { id: 10, transaction: "Oil Change", amount: 110.75, station: "Al-Aziziyah Station - Mecca", date: "2025-08-10", status: "Pending" },
        { id: 11, transaction: "Fuel Purchase", amount: 260.50, station: "Al-Murabba Station - Riyadh", date: "2025-08-11", status: "Success" },
        { id: 12, transaction: "Car Wash", amount: 45.00, station: "Al-Nuzha Station - Jeddah", date: "2025-08-12", status: "Success" },
        { id: 13, transaction: "Fuel Purchase", amount: 190.00, station: "Al-Qadisiyah Station - Dammam", date: "2025-08-13", status: "Failed" },
        { id: 14, transaction: "Fuel Purchase", amount: 310.25, station: "Al-Nahda Station - Medina", date: "2025-08-14", status: "Pending" },
        { id: 15, transaction: "Oil Change", amount: 130.00, station: "Al-Rawabi Station - Jeddah", date: "2025-08-15", status: "Success" },
        { id: 16, transaction: "Fuel Purchase", amount: 210.75, station: "Al-Waha Station - Riyadh", date: "2025-08-16", status: "Success" },
        { id: 17, transaction: "Car Wash", amount: 55.50, station: "Al-Hamra Station - Dammam", date: "2025-08-17", status: "Pending" },
        { id: 18, transaction: "Fuel Purchase", amount: 280.00, station: "Al-Yarmouk Station - Mecca", date: "2025-08-18", status: "Success" }
    ];
}
