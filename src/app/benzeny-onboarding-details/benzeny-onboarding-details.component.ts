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
    ];

    selectedOtp = this.tabNames[this.activeTab5 - 1]; // المرحلة الحالية حسب activeTab5

    // إرجاع المراحل التي تظهر في select (الحالية + اللي فاتت + المرحلة التالية فقط)
    get availableTabs(): string[] {
        const prevTabs = this.tabNames.slice(0, this.activeTab5); // السابقة
        const nextTab = this.tabNames[this.activeTab5] ? [this.tabNames[this.activeTab5]] : []; // التالية
        return [...prevTabs, ...nextTab];
    }

    getTabColor(tab: number): string {
        const tabName = this.tabNames[tab - 1];

        if (tabName === 'DONE') return '#28a745'; // أخضر للـ DONE
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
