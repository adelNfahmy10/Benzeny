import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconModule } from '../shared/icon/icon.module';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { OnboardingService } from '../service/analysis/onboarding.service';

@Component({
  selector: 'app-benzeny-onboarding',
  standalone: true,
  imports: [DataTableModule, FormsModule, NgClass, IconModule],
  templateUrl: './benzeny-onboarding.component.html',
  styleUrl: './benzeny-onboarding.component.css'
})
export class BenzenyOnboardingComponent implements OnInit{
    private readonly _OnboardingService = inject(OnboardingService)
    private readonly _Router = inject(Router)

    search = '';

    cardStats:any = {}
    onboardingTable:any[] = []

    onboardingColumns = [
        { field: 'name', title: 'Company' },
        { field: 'ownerName', title: 'Contact Person' },
        { field: 'companyPhone', title: 'Phone Number' },
        { field: 'status', title: 'Status'},
        { field: 'vehicleCount', title: 'Vehicles'}
    ];


    ngOnInit(): void {
        this.getOnboardingStats()
        this.getOnboardingTable()
    }

    getOnboardingStats():void{
        this._OnboardingService.getOnboardingStats().subscribe({
            next:(res)=>{
                this.cardStats = res.data
            }
        })
    }


    getOnboardingTable():void{
        this._OnboardingService.getOnboardingTable().subscribe({
            next:(res)=>{
                this.onboardingTable = res.data
                this.applyFilter(); // فلترة بعد التحميل
            }
        })
    }


    tabs: string[] = ['All', 'Active', 'In Progress', 'Rejected'];

    activeTab: string = 'All';

    filteredItems: any[] = [];


    // توحيد الـ status
    getNormalizedStatus(status: string | null): string {
        console.log(status);

        if (status == 'Done') return 'Active';
        if (!status) return 'Rejected';
        return 'In Progress';
    }

    // تغيير التاب
    activeTabs(tab: string): void {
        this.activeTab = tab;
        console.log(tab);

        this.applyFilter();
    }

    // تطبيق الفلترة
    applyFilter(): void {
        console.log(this.filteredItems);

        if (this.activeTab === 'All') {
            this.filteredItems = this.onboardingTable;
        }
        else if (this.activeTab === 'Active') {
            // Active = status === Done
            this.filteredItems = this.onboardingTable.filter(item => item.status === 'Done');
        }
        else if (this.activeTab === 'In Progress') {
            // أي status موجود غير Done و غير null/Rejected
            this.filteredItems = this.onboardingTable.filter(
                item => item.status && item.status !== 'Done' && item.status !== 'Rejected'
            );
        }
        else if (this.activeTab === 'Rejected') {
            // Rejected = status null أو 'Rejected'
            this.filteredItems = this.onboardingTable.filter(
            item => !item.status || item.status === 'Rejected'
            );
        }
    }

    onRowClick(company: any) {
        this._Router.navigate(['/benzeny-onboarding-details/' + company.id])
    }
}
