import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-benzeny-onboarding-details',
  standalone: true,
  imports: [DataTableModule, FormsModule, IconModule, NgClass, CommonModule, NgSelectComponent],
  templateUrl: './benzeny-onboarding-details.component.html',
  styleUrl: './benzeny-onboarding-details.component.css'
})
export class BenzenyOnboardingDetailsComponent {
    tab: string = 'overview';
    // component.ts
    activeTab5 = 1;
    level = 'Low'; // Small | Medium | High
    tabNames: string[] = [
        'Negotiation',
        'Proposal',
        'Decision',
        'Documents',
        'Verification',
        'Access',
        'Setup',
        'Installation',
        'Active',
        'DONE'
    ]

    tableData = [
        {
            id: 1,
            name: 'John Doe',
            period:'January 2026',
            data:'Jan 31, 2026',
            amount:'$100.00',
            status:'Paid',
        },
        {
            id: 2,
            name: 'Shaun Park',
            period:'January 2026',
            data:'Jan 5, 2026',
            amount:'$100.00',
            status:'Upcoming',
        },
        {
            id: 3,
            name: 'Alma Clarke',
            period:'January 2026',
            data:'Jan 28, 2026',
            amount:'$100.00',
            status:'Pending',
        },
        {
            id: 4,
            name: 'Vincent Carpenter',
            period:'January 2026',
            data:'Jan 2, 2026',
            amount:'$100.00',
            status:'Paid',
        },
    ]

     tableData2 = [
        {
            id: 1,
            name: 'John Doe',
            date:'March 15, 2026 at 2:30 PM',
            type:'Subscription Payment',
            method:'Bank Transfer',
            amount:'+$500.00',
        },
        {
            id: 2,
            name: 'Shaun Park',
            date:'February 28, 2026 at 11:00 AM',
            type:'Main Account Top-up',
            method:'Monthly subscription fee',
            amount:'-$100.00',
        },
        {
            id: 3,
            name: 'Alma Clarke',
            date:'February 10, 2026 at 9:15 AM',
            type:'Subscription Payment',
            method:'Credit Card',
            amount:'+$750.00',
        },
        {
            id: 4,
            name: 'Vincent Carpenter',
            date:'January 31, 2026 at 10:45 AM',
            type:'Subscription Payment',
            method:'Monthly subscription fee',
            amount:'-$100.00',
        },
        {
            id: 5,
            name: 'Vincent Carpenter',
            date:'January 5, 2026 at 3:00 PM',
            type:'Main Account Top-up',
            method:'Bank Transfer',
            amount:'+$870.00',
        },
    ]

    selectedOtp = this.tabNames[this.activeTab5 - 1]; // المرحلة الحالية حسب activeTab5

    // إرجاع المراحل التي تظهر في select (الحالية + اللي فاتت + المرحلة التالية فقط)
    get availableTabs(): string[] {
        const prevTabs = this.tabNames.slice(0, this.activeTab5); // السابقة
        const nextTab = this.tabNames[this.activeTab5] ? [this.tabNames[this.activeTab5]] : []; // التالية
        return [...prevTabs, ...nextTab];
    }

    getTabColor(tab: number): string {
        if (this.isTabActive(tab)) return '#f79320'; // برتقالي للتاب الحالي
        if (this.isTabFinished(tab)) return '#f79320'; // برتقالي للسابقة
        return '#f3f2ee'; // اللون العادي للتاب القادمة
    }

    getProgressWidth(): string {
        // لو التاب الحالي آخر تاب (DONE)، نخلي العرض على آخر تاب قبلها
        const lastIndex = this.tabNames.length - 1; // index بتاع DONE
        const currentIndex = Math.min(this.activeTab5, lastIndex); // متأكدين انه ما يتجاوزش DONE
        return (currentIndex * 10.5) + '%'; // حسب النسبة اللي انت محسبها
    }

    isTabDone(tab: number): boolean {
        return this.tabNames[tab - 1] === 'DONE' && (this.isTabActive(tab) || this.isTabFinished(tab));
    }

    // لما المستخدم يغير الاختيار من select
    changeOption(newSelect: string): void {
        this.selectedOtp = newSelect;

        const tabIndex = this.tabNames.indexOf(newSelect);
        // يتحرك للتاب الجديد إذا هو الحالي أو اللي بعده
        if (this.canClickTab(tabIndex + 1)) {
            this.activeTab5 = tabIndex + 1;
        }

        // لو وصلنا لآخر تاب، نخلي activeTab5 = طول التابات عشان يتعامل معها كـ finished
        if (tabIndex + 1 >= this.tabNames.length) {
            this.activeTab5 = this.tabNames.length;
        } else if (this.canClickTab(tabIndex + 1)) {
            this.activeTab5 = tabIndex + 1;
        }
    }

    canClickTab(tab: number): boolean {
        return tab >= this.activeTab5;
    }

    isTabFinished(tab: number): boolean {
        return tab < this.activeTab5;
    }

    isTabActive(tab: number): boolean {
        return tab === this.activeTab5;
    }
}
