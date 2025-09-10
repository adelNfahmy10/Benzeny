import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'company', title: 'Compnay' },
        { field: 'packageAmount', title: 'Package' },
        { field: 'startDate', title: 'Start Date' },
        { field: 'endDate', title: 'End Date' },
        { field: 'extraCost', title: 'Extra Cost' },
        { field: 'totalAmount', title: 'Total Amount' },
        { field: 'isActive', title: 'Status' },
    ];

    subscriptionsRows = [
        {
            id: 1,
            company: "Saudi Transport Co.",
            packageAmount: 5000,
            startDate: "2025-01-01",
            endDate: "2025-03-31",
            extraCost: 200,
            totalAmount: 5200,
            isActive: "Active"
        },
        {
            id: 2,
            company: "Al Riyadh Logistics",
            packageAmount: 4500,
            startDate: "2025-02-01",
            endDate: "2025-04-30",
            extraCost: 150,
            totalAmount: 4650,
            isActive: "Expired"
        },
        {
            id: 3,
            company: "Mecca Cargo",
            packageAmount: 6000,
            startDate: "2025-03-01",
            endDate: "2025-05-31",
            extraCost: 300,
            totalAmount: 6300,
            isActive: "Active"
        },
        {
            id: 4,
            company: "Jeddah Movers",
            packageAmount: 4000,
            startDate: "2025-01-15",
            endDate: "2025-04-14",
            extraCost: 250,
            totalAmount: 4250,
            isActive: "Active"
        },
        {
            id: 5,
            company: "Dammam Express",
            packageAmount: 5500,
            startDate: "2025-02-10",
            endDate: "2025-05-09",
            extraCost: 100,
            totalAmount: 5600,
            isActive: "Expired"
        },
        {
            id: 6,
            company: "Tabuk Logistics",
            packageAmount: 4800,
            startDate: "2025-03-05",
            endDate: "2025-06-04",
            extraCost: 180,
            totalAmount: 4980,
            isActive: "Active"
        },
        {
            id: 7,
            company: "Najran Cargo",
            packageAmount: 5200,
            startDate: "2025-01-20",
            endDate: "2025-04-19",
            extraCost: 220,
            totalAmount: 5420,
            isActive: "Expired"
        },
        {
            id: 8,
            company: "Taif Transport",
            packageAmount: 6000,
            startDate: "2025-02-25",
            endDate: "2025-05-24",
            extraCost: 300,
            totalAmount: 6300,
            isActive: "Active"
        },
        {
            id: 9,
            company: "Hail Movers",
            packageAmount: 4700,
            startDate: "2025-03-12",
            endDate: "2025-06-11",
            extraCost: 200,
            totalAmount: 4900,
            isActive: "Active"
        },
        {
            id: 10,
            company: "Qassim Logistics",
            packageAmount: 5100,
            startDate: "2025-01-28",
            endDate: "2025-04-27",
            extraCost: 250,
            totalAmount: 5350,
            isActive: "Expired"
        },
        {
            id: 11,
            company: "Yanbu Express",
            packageAmount: 5800,
            startDate: "2025-02-15",
            endDate: "2025-05-14",
            extraCost: 180,
            totalAmount: 5980,
            isActive: "Active"
        },
        {
            id: 12,
            company: "Medina Transport",
            packageAmount: 6200,
            startDate: "2025-03-20",
            endDate: "2025-06-19",
            extraCost: 220,
            totalAmount: 6420,
            isActive: "Active"
        },
        {
            id: 13,
            company: "Khobar Cargo",
            packageAmount: 4900,
            startDate: "2025-01-10",
            endDate: "2025-04-09",
            extraCost: 150,
            totalAmount: 5050,
            isActive: "Expired"
        },
        {
            id: 14,
            company: "Abha Logistics",
            packageAmount: 5300,
            startDate: "2025-02-18",
            endDate: "2025-05-17",
            extraCost: 200,
            totalAmount: 5500,
            isActive: "Active"
        },
        {
            id: 15,
            company: "Jizan Transport",
            packageAmount: 5600,
            startDate: "2025-03-08",
            endDate: "2025-06-07",
            extraCost: 250,
            totalAmount: 5850,
            isActive: "Active"
        },
        {
            id: 16,
            company: "Al Khafji Express",
            packageAmount: 6000,
            startDate: "2025-01-05",
            endDate: "2025-04-04",
            extraCost: 300,
            totalAmount: 6300,
            isActive: "Expired"
        },
        {
            id: 17,
            company: "Riyadh Logistics Pro",
            packageAmount: 4800,
            startDate: "2025-02-12",
            endDate: "2025-05-11",
            extraCost: 200,
            totalAmount: 5000,
            isActive: "Active"
        },
        {
            id: 18,
            company: "Mecca Transporters",
            packageAmount: 5400,
            startDate: "2025-03-01",
            endDate: "2025-05-30",
            extraCost: 220,
            totalAmount: 5620,
            isActive: "Active"
        }
    ];
}
