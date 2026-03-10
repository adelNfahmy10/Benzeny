import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from '../shared/icon/icon.module';
import { NgSelectComponent } from '@ng-select/ng-select';
import { OnboardingService } from '../service/analysis/onboarding.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-benzeny-onboarding-details',
  standalone: true,
  imports: [DataTableModule, FormsModule, IconModule, NgClass, CommonModule, NgSelectComponent],
  templateUrl: './benzeny-onboarding-details.component.html',
  styleUrl: './benzeny-onboarding-details.component.css'
})
export class BenzenyOnboardingDetailsComponent implements OnInit{
    private readonly _OnboardingService = inject(OnboardingService);
    private readonly _ActivatedRoute = inject(ActivatedRoute);

    companyId: string | null = null;
    companyDetails: any = {};

    ngOnInit(): void {
        this.getCompanyDetails();
    }

    // جلب تفاصيل الشركة
    getCompanyDetails(): void {
    this._ActivatedRoute.paramMap
        .pipe(
        switchMap(params => {
            this.companyId = params.get('id');
            return this._OnboardingService.getOnboardingCompanyDetails(this.companyId);
        })
        )
        .subscribe({
        next: (res) => {
            this.companyDetails = res.data;

            // 🟢 تعيين الـ selectedOtp من الـ backend
            this.selectedOtp = this.companyDetails.status || this.tabNames[0];

            // 🟢 تعيين الـ activeTab5 حسب الـ status
            const statusIndex = this.tabNames.indexOf(this.selectedOtp);
            this.activeTab5 = statusIndex >= 0 ? statusIndex + 1 : 1;

            // 🟢 تحديد الـ priority حسب الـ tab الحالي
            this.priority = this.getPriorityForTab(statusIndex >= 0 ? statusIndex : 0);
        },
        error: (err) => console.error(err)
        });
    }


    activeTab5 = 1;
    priority: 'Low' | 'Medium' | 'High' = 'Low';

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

    selectedOtp: string = this.tabNames[this.activeTab5 - 1];

    // بدل ما المستخدم يختار priority، نحدده تلقائي
    getPriorityForTab(tabIndex: number): 'Low' | 'Medium' | 'High' {
        if (tabIndex <= 1) return 'Low';           // Negotiation, Proposal
        if (tabIndex <= 4) return 'Medium';        // Decision, Documents, Verification
        return 'High';                             // Access, Setup, Installation, Active
    }

    // لما المستخدم يغير select
    changeOption(newSelect: string): void {
        const tabIndex = this.tabNames.indexOf(newSelect);

        // لو المستخدم حاول يرجع لتاب سابق، ignore
        if (!this.canClickTab(tabIndex + 1)) {
            return; // ممنوع
        }

        this.selectedOtp = newSelect;
        this.activeTab5 = tabIndex + 1;

        // تحديد الـ priority حسب الـ tab
        this.priority = this.getPriorityForTab(tabIndex);

        // تحديث الـ backend
        const data = {
            companyId: this.companyId,
            status: this.selectedOtp,
            priority: this.priority
        };

        this._OnboardingService.UpdateOnboardingCompanyStatus(data).subscribe({
            next: res => console.log('Updated status & priority:', res),
            error: err => console.error(err)
        });
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







    tab: string = 'overview';

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




}
