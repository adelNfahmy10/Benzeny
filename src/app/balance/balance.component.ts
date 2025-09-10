import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule, RouterLink],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'company', title: 'Company' },
        { field: 'IBAN', title: 'Iban' },
        { field: 'amount', title: 'Amount' },
        { field: 'isActive', title: 'Status' },
    ];

    bankTransfers = [
        { id: 1, company: "Saudi Transport Co.", IBAN: "SA0380000000608010167519", amount: 12000, isActive: "Success" },
        { id: 2, company: "Al Jazeera Logistics", IBAN: "SA4420000001234567891234", amount: 8500, isActive: "Pending" },
        { id: 3, company: "Riyadh Express", IBAN: "SA7550000009876543216543", amount: 15000, isActive: "Failed" },
        { id: 4, company: "Eastern Fuel Co.", IBAN: "SA3208000000245796312547", amount: 7200, isActive: "Success" },
        { id: 5, company: "Najd Cargo", IBAN: "SA6590000000987654321123", amount: 9600, isActive: "Pending" },
        { id: 6, company: "Al Haramain Fleet", IBAN: "SA1196000000765432198456", amount: 13400, isActive: "Success" },
        { id: 7, company: "Gulf Petroleum", IBAN: "SA5047000000231985476321", amount: 11000, isActive: "Failed" },
        { id: 8, company: "Saudi Cargo Lines", IBAN: "SA8891000000123498756321", amount: 7800, isActive: "Success" },
        { id: 9, company: "Desert Transport", IBAN: "SA2712000000765432189632", amount: 9200, isActive: "Pending" },
        { id: 10, company: "Mecca Transport Co.", IBAN: "SA6085000000345678901234", amount: 14000, isActive: "Success" },
        { id: 11, company: "Jeddah Fleet Services", IBAN: "SA9307000000654321987456", amount: 12500, isActive: "Failed" },
        { id: 12, company: "Arabian Logistics", IBAN: "SA5553000000543219874567", amount: 8700, isActive: "Pending" },
        { id: 13, company: "Trans Gulf Co.", IBAN: "SA8026000000321987456123", amount: 10000, isActive: "Success" },
        { id: 14, company: "Red Sea Transport", IBAN: "SA1474000000765432189512", amount: 9400, isActive: "Pending" },
        { id: 15, company: "Najran Logistics", IBAN: "SA4698000000456789012345", amount: 11300, isActive: "Success" },
        { id: 16, company: "Saudi Express Lines", IBAN: "SA7321000000123987456123", amount: 12800, isActive: "Failed" },
        { id: 17, company: "Middle East Transport", IBAN: "SA2219000000987654321876", amount: 11900, isActive: "Success" }
    ];
}
