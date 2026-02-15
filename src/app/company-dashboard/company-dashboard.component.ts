import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IconModule } from "../shared/icon/icon.module";
import { Store } from '@ngrx/store';
import { MenuModule } from "headlessui-angular";
import { NgApexchartsModule } from "ng-apexcharts";
import Swal from 'sweetalert2';
import { ClipboardModule } from "ngx-clipboard";
import { FormsModule } from '@angular/forms';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompaniesService } from '../service/companies/companies.service';
import { BranchService } from '../service/branches/branch.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { CarService } from '../service/car/car.service';
import { DriverService } from '../service/driver/driver.service';
import { DataTableModule } from "@bhplugin/ng-datatable";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe, NgClass } from '@angular/common';
import { UserService } from '../service/users/user.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [IconModule, MenuModule, NgApexchartsModule, ClipboardModule, FormsModule, DataTableModule, RouterLink, NgClass, DatePipe],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit{
    private readonly _ActivatedRoute = inject(ActivatedRoute)
    private readonly _CompaniesService = inject(CompaniesService)
    private readonly _BranchService = inject(BranchService)
    private readonly _CarService = inject(CarService)
    private readonly _DriverService = inject(DriverService)
    private readonly _UserService = inject(UserService)

    store: any;
    savingChart: any;
    transactionVolum: any;
    dailyTransactions: any;
    isLoading = true;

    companyData:WritableSignal<any> = signal({})
    companyId:WritableSignal<string | null> = signal(localStorage.getItem('companyId') || '')
    mainRole = localStorage.getItem('roles')?.split(',').map(r => r.trim()) || [];
    role:WritableSignal<string | null> = signal(localStorage.getItem('role') || '')
    allUsersInCompany:WritableSignal<any[]> = signal([])
    usersCount:WritableSignal<any[]> = signal([])
    activeUsersCount:WritableSignal<any[]> = signal([])
    deActiveUsersCount:WritableSignal<any[]> = signal([])
    allBranches:WritableSignal<any[]> = signal([])
    allCarsCount:WritableSignal<any> = signal({})
    allDriversCount:WritableSignal<any> = signal({})
    totalBranches:WritableSignal<number> = signal(0)
    totalActiveBranches:WritableSignal<number> = signal(0)
    totalDeActiveBranches:WritableSignal<number> = signal(0)
    pageNumber:number = 1
    pageSize:number = 10
    searchTerm:string = ''
    datatable2Cols = [
        { field: 'companyName', title: 'Company Name' },
        { field: 'regionTitle', title: 'Region' },
        { field: 'cityTitle', title: 'City' },
        { field: 'address', title: 'Address' },
        { field: 'phoneNumber', title: 'Phone No.' },
        { field: 'iban', title: 'IBAN' },
        { field: 'isActive', title: 'Status' },
        { field: 'action', title: 'Action', sort: false },
    ];

    // Search Data
    searchBranch(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.GetAllBranchesByCompanyId( this.companyId()!, this.pageNumber, this.pageSize, this.searchTerm)
    }

    // Pagination Handler
    onPageChange(page: number): void {
        this.pageNumber = page
        this.GetAllBranchesByCompanyId( this.companyId()!, this.pageNumber, this.pageSize, this.searchTerm)
    }

    onPageSizeChange(size: number): void {
        this.pageSize = size
        this.pageNumber = 1
        this.GetAllBranchesByCompanyId( this.companyId()!, this.pageNumber, this.pageSize, this.searchTerm)
    }

    ngOnInit(): void {
        this.getCompaniesData()
        this.GetAllCarsInCompany()
        this.GetAllDriversInCompany()
        this.GetAllUsersInCompany()
    }

    // Get Company Data By Id
    getCompaniesData(): void {
        if (this.mainRole.includes('CompanyOwner') || this.mainRole.includes('Admin') || this.mainRole.includes('BranchManager')) {
            this.fetchCompany(this.companyId()!);
        } else if (this.mainRole.includes('BSuperAdmin')) {
            this._ActivatedRoute.paramMap.pipe(
                map(params => params.get('id')),
                filter((id): id is string => !!id),
                tap(id => this.companyId.set(id)),
                switchMap(id => this._CompaniesService.GetCompanyById(id))
            ).subscribe({
                next: (res) => {
                    this.companyData.set(res.data);
                    this.GetAllBranchesByCompanyId();
                }
            });
        }
    }

    fetchCompany(id: string): void {
        this._CompaniesService.GetCompanyById(id).subscribe({
            next: (res) => {
                this.companyData.set(res.data);
                this.GetAllBranchesByCompanyId();
            }
        });
    }

    // Get All Branches In Company
    GetAllBranchesByCompanyId(companyId:string = this.companyId()! , pageNumber:number = 1, pageSize:number = 10, searchTerm:string = '' ):void{
        this._BranchService.GetAllBranchesByCompanyId(companyId, pageNumber, pageSize, searchTerm).subscribe({
            next:(res)=>{
                this.allBranches.set(res.data.items)
                this.totalBranches.set(res.data.totalCount)
                this.totalActiveBranches.set(res.data.activeCount)
                this.totalDeActiveBranches.set(res.data.inActiveCount)
            }
        })
    }

    // Get All Cars In Company
    GetAllCarsInCompany():void{
        this._CarService.GetAllCarsInCompany(this.companyId()!).subscribe({
            next:(res)=>{
                this.allCarsCount.set(res.data)
                console.log(this.allCarsCount());
            }
        })
    }

    // Get All Drivers In Company
    GetAllDriversInCompany():void{
        this._DriverService.GetDriversInCompany(this.companyId()!).subscribe({
            next:(res)=>{
                this.allDriversCount.set(res.data)
            }
        })
    }

    // Get All Users In Company
    GetAllUsersInCompany():void{
        this._UserService.GetAllUsersByCompanyId(this.companyId()!).subscribe({
            next:(res)=>{
                this.allUsersInCompany.set(res.data.users)
                this.usersCount.set(res.data.totalCount)
                this.activeUsersCount.set(res.data.activeCount)
                this.deActiveUsersCount.set(res.data.inActiveCount)
                console.log(this.allUsersInCompany());
            }
        })
    }
    /* Export Data Table Excel, Pdf, Print */
    capitalize(text: string) {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    }

    exportTable(type: string) {
        let columns: any = this.datatable2Cols.map((d: { field: any }) => {
            return d.field;
        });

        let records = this.allBranches();
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type == 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return this.capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: { [x: string]: any }) => {
                columns.map((d: any, index: number) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type == 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + this.capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            records.map((item: { [x: string]: any }) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>' + filename + '</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.onafterprint = () => {
                winPrint.close();
            };
            winPrint.print();
        } else if (type == 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return this.capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: { [x: string]: any }) => {
                columns.map((d: any, index: number) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.txt');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.txt');
                }
            }
        }
    }

    downloadPdf() {
        const doc = new jsPDF();
        const filteredCols = this.datatable2Cols.filter(col => col.title !== 'Action');
        autoTable(doc, {
            head: [filteredCols.map(col => col.title)],
            body: this.allBranches().map(branch => [branch.id, branch.regionTitle, branch.cityTitle, branch.phoneNumber, branch.iban, branch.isActive]),
        });
        doc.save('branches-list.pdf');
    }

    constructor(public storeData: Store<any>) {
        this.initStore();
        this.isLoading = false;
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }

    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // Saving Money Chart
        this.savingChart = {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#F79320', '#f00'] : ['#F79320', '#f00'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#F79320',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#f00',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
            series: [
                {
                    name: 'Saving',
                    data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
                },
                {
                    name: 'Solar',
                    data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
                },
            ],
        };

        // transaction Volum
        this.transactionVolum = {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Apparel', 'Sports', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
            series: [985, 737, 270],
        };

        // daily Transactions
        this.dailyTransactions = {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e2a03f', '#e2a03f', '#e2a03f', '#e2a03f', '#e2a03f', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        }
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    columnWidth: '25%',         // 👈 أرفع العمود
                    borderRadius: 3,            // 👈 radius بسيط
                    borderRadiusApplication: 'end', // بس من فوق
                    barHeight: '100%',          // لو عايز تحافظ على الطول
                }
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0,
                }
            },
            series: [
                {
                    name: 'Transaction Amount',
                    data: [44, 55, 41, 67, 22, 43, 21],
                }
            ],
        };
    }

    message1 = this.companyData().iban || 'SA03 8000 0000 6080 1016 7519';
    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }

    items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];
    swiper4: any;
    ngAfterViewInit() {
        this.swiper4 = new Swiper('#slider4', {
            modules: [Navigation, Pagination, Autoplay],
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            autoplay: { delay: 2000 },
            navigation: { nextEl: '.swiper-button-next-ex4', prevEl: '.swiper-button-prev-ex4' },
            pagination: {
                el: '#slider4 .swiper-pagination',
                type: 'fraction',
                clickable: true,
            },
        });
    }
}
