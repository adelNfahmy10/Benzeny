import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconModule } from '../shared/icon/icon.module';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';

@Component({
  selector: 'app-benzeny-onboarding',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './benzeny-onboarding.component.html',
  styleUrl: './benzeny-onboarding.component.css'
})
export class BenzenyOnboardingComponent {
    private readonly _Router = inject(Router)

    search = '';
    cols = [
        { field: 'id', title: 'ID', isUnique: true },
        { field: 'company', title: 'Company' },
        { field: 'contact', title: 'Contact Person' },
        { field: 'phone', title: 'Phone Number' },
        { field: 'isActive', title: 'Status' },
        { field: 'vehicles', title: 'Vehicles' },
    ];

    onboardingItems = [
        { id: 1, company: "Saudi Transport Co.", contact: "Ahmed Al-Fahad", phone: 12000, isActive: "Active", vehicles: 30 },
        { id: 2, company: "Al Jazeera Logistics", contact: "Fatima Al-Mansour", phone: 8500, isActive: "In Progress", vehicles: 15 },
        { id: 3, company: "Riyadh Express", contact: "Mohammed Al-Saud", phone: 15000, isActive: "Rejected", vehicles: 20 },
        { id: 4, company: "Eastern Fuel Co.", contact: "Sara Al-Harbi", phone: 7200, isActive: "In Progress", vehicles: 12 },
        { id: 5, company: "Najd Cargo", contact: "Omar Al-Rashid", phone: 9600, isActive: "In Progress", vehicles: 18 },
        { id: 6, company: "Al Haramain Fleet", contact: "Noura Al-Fahad", phone: 13400, isActive: "Active", vehicles: 25 },
        { id: 7, company: "Gulf Petroleum", contact: "Khalid Al-Jabri", phone: 11000, isActive: "Rejected", vehicles: 10 },
        { id: 8, company: "Saudi Cargo Lines", contact: "Layla Al-Mutairi", phone: 7800, isActive: "Active", vehicles: 14 },
        { id: 9, company: "Desert Transport", contact: "Fahad Al-Qahtani", phone: 9200, isActive: "In Progress", vehicles: 16 },
        { id: 10, company: "Mecca Transport Co.", contact: "Aisha Al-Harbi", phone: 14000, isActive: "Active", vehicles: 22 },
        { id: 11, company: "Jeddah Fleet Services", contact: "Sami Al-Rashed", phone: 12500, isActive: "Rejected", vehicles: 13 },
        { id: 12, company: "Arabian Logistics", contact: "Dana Al-Shehri", phone: 8700, isActive: "In Progress", vehicles: 17 },
        { id: 13, company: "Trans Gulf Co.", contact: "Yousef Al-Fahad", phone: 10000, isActive: "Active", vehicles: 19 },
    ];

    tabs: string[] = ['All', 'Active', 'In Progress', 'Rejected'];

    activeTab: string = 'All'; // افتراضي All

    activeTabs(tab:any):void{
        this.activeTab = tab;
    }

    // فلترة العناصر حسب الـ activeTab
    get filteredItems() {
        if (this.activeTab === 'All') {
            return this.onboardingItems;
        }
        return this.onboardingItems.filter(item => item.isActive === this.activeTab);
    }

    onRowClick(company: any) {
        this._Router.navigate(['/benzeny-onboarding-details/' + company.id])
    }
}
