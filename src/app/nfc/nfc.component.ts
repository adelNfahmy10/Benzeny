import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from "@bhplugin/ng-datatable";
import { IconModule } from "../shared/icon/icon.module";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nfc',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule, RouterLink],
  templateUrl: './nfc.component.html',
  styleUrl: './nfc.component.css'
})
export class NfcComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'nfc', title: 'NFC', isUnique: true },
        { field: 'company', title: 'Compnay' },
        { field: 'driver', title: 'Driver' },
        { field: 'isActive', title: 'Status' },
        { field: 'action', title: 'Action', sort: false },
    ];

    nfcRows = [
        { id: 1, company: 'POLARAX', driver: 'Caroline Jensen', nfc: 'NFC-1001', isActive: true},
        { id: 2, company: 'MANGLO', driver: 'Celeste Grant', nfc: 'NFC-1002', isActive: false},
        { id: 3, company: 'APPLIDECK', driver: 'Tillman Forbes', nfc: 'NFC-1003', isActive: true},
        { id: 4, company: 'VOLAX', driver: 'Daisy Whitley', nfc: 'NFC-1004', isActive: true},
        { id: 5, company: 'ORBAXTER', driver: 'Weber Bowman', nfc: 'NFC-1005', isActive: false},
        { id: 6, company: 'OPPORTECH', driver: 'Buckley Townsend', nfc: 'NFC-1006', isActive: true},
        { id: 7, company: 'GORGANIC', driver: 'Latoya Bradshaw', nfc: 'NFC-1007', isActive: true},
        { id: 8, company: 'AVIT', driver: 'Kate Lindsay', nfc: 'NFC-1008', isActive: true},
        { id: 9, company: 'QUILCH', driver: 'Marva Sandoval', nfc: 'NFC-1009', isActive: false},
        { id: 10, company: 'MEMORA', driver: 'Decker Russell', nfc: 'NFC-1010', isActive: false},
        { id: 11, company: 'ZORROMOP', driver: 'Odom Mills', nfc: 'NFC-1011', isActive: true},
        { id: 12, company: 'ORBOID', driver: 'Sellers Walters', nfc: 'NFC-1012', isActive: true},
        { id: 13, company: 'SNORUS', driver: 'Wendi Powers', nfc: 'NFC-1013', isActive: true},
        { id: 14, company: 'XTH', driver: 'Sophie Horn', nfc: 'NFC-1014', isActive: true},
        { id: 15, company: 'COMTRACT', driver: 'Levine Rodriquez', nfc: 'NFC-1015', isActive: true},
        { id: 16, company: 'ZIDANT', driver: 'Little Hatfield', nfc: 'NFC-1016', isActive: false},
        { id: 17, company: 'SUREPLEX', driver: 'Larson Kelly', nfc: 'NFC-1017', isActive: true},
        { id: 18, company: 'DANJA', driver: 'Kendra Molina', nfc: 'NFC-1018', isActive: false},
    ];

}
