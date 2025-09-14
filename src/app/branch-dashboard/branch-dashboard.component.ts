import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IconModule } from "../shared/icon/icon.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { Store } from '@ngrx/store';
import { BranchService } from '../service/branches/branch.service';
import { DriverService } from '../service/driver/driver.service';
import { CarService } from '../service/car/car.service';
import Swal from 'sweetalert2';
import { ClipboardModule } from "ngx-clipboard";
import { NgClass } from '@angular/common';
import { DataTableModule } from "@bhplugin/ng-datatable";
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-branch-dashboard',
  standalone: true,
  imports: [IconModule, NgApexchartsModule, ClipboardModule, NgClass, DataTableModule],
  templateUrl: './branch-dashboard.component.html',
  styleUrl: './branch-dashboard.component.css'
})
export class BranchDashboardComponent implements OnInit{
    private readonly _BranchService = inject(BranchService)
    private readonly _DriverService = inject(DriverService)
    private readonly _CarService = inject(CarService)
    private readonly _ActivatedRoute = inject(ActivatedRoute)

    branchData:WritableSignal<any> = signal({})
    branchId:WritableSignal<string | null> = signal(localStorage.getItem('branchId') || '')
    role:WritableSignal<string | null> = signal(localStorage.getItem('role') || '')
    allDrivers:WritableSignal<any[]> = signal([])
    allCars:WritableSignal<any[]> = signal([])
    carsCount:WritableSignal<any> = signal({})
    totalActiveCars:WritableSignal<number> = signal(0)
    totalDeActiveCars:WritableSignal<number> = signal(0)
    driversCount:WritableSignal<any> = signal({})
    totalActiveDrivers:WritableSignal<number> = signal(0)
    totalDeActiveDrivers:WritableSignal<number> = signal(0)

    pageNumber:number = 1
    pageSize:number = 10
    searchTerm:string = ''
    ColsCars = [
        { field: 'carModel', title: 'Model' },
        { field: 'carBrand', title: 'Brand' },
        { field: 'carNumber', title: 'Car Number' },
        { field: 'color', title: 'Color' },
        { field: 'plateType', title: 'Plate Type' },
        { field: 'petrolType', title: 'Petrol Type' },
        { field: 'driversName', title: 'Drivers' },
        { field: 'isActive', title: 'Status' },
    ];

    ColsDrivers = [
        { field: 'fullName', title: 'Name' },
        { field: 'phoneNumber', title: 'Phone' },
        { field: 'tagName', title: 'Tag' },
        { field: 'carPlate', title: 'Car' },
        { field: 'consumptionType', title: 'Consumption Type' },
        { field: 'balance', title: 'Balance' },
        { field: 'isActive', title: 'Status' }
    ];

    ngOnInit(): void {
        this.GetBranchById()
        this.GetAllCarsInBranch()
        this.GetDriversInBranch()

    }

    // Get Company Data By Id
    GetBranchById(): void {
        if(this.branchId() !== 'undefined'){
            this._BranchService.GetBranchById(this.branchId()).subscribe({
                next:(res)=>{
                    this.branchData.set(res.data)
                }
            })
        } else if(this.branchId()){
            this._ActivatedRoute.paramMap.subscribe({
                next:(params)=>{
                    this.branchId.set(params.get('id'))
                     this._BranchService.GetBranchById(this.branchId()).subscribe({
                        next:(res)=>{
                            this.branchData.set(res.data)
                        }
                    })
                }
            })
        }

    }

    GetAllCarsInBranch(branchId:string = this.branchId()!, searchTerm:string = '' , pageNumber:number = 1, pageSize:number = 10 ):void{
        this._CarService.GetAllCarsInBranch(branchId, searchTerm, pageNumber, pageSize).subscribe({
            next:(res)=>{
                this.allCars.set(res.data.items)
                this.carsCount.set(res.data.totalCount)
                this.totalActiveCars.set(res.data.activeCount)
                this.totalDeActiveCars.set(res.data.inActiveCount)
            }
        })
    }

    GetDriversInBranch(branchId:string = this.branchId()!, searchTerm:string = '' , pageNumber:number = 1, pageSize:number = 10 ):void{
        this._DriverService.GetDriversInBranch(branchId, searchTerm, pageNumber, pageSize).subscribe({
            next:(res)=>{
                this.allDrivers.set(res.data.items)
                this.driversCount.set(res.data.totalCount)
                this.totalActiveDrivers.set(res.data.activeCount)
                this.totalDeActiveDrivers.set(res.data.inActiveCount)
            }
        })
    }

    // Search Car Data
    searchCar(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.GetAllCarsInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
    }

    // Pagination Handler Cars
    onPageChange(page: number): void {
        this.pageNumber = page
         this.GetAllCarsInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
    }

    onPageSizeChange(size: number): void {
        this.pageSize = size
        this.pageNumber = 1
        this.GetAllCarsInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
    }

    // Search Drvier Data
    searchDriver(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.GetDriversInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
    }

    // Pagination Handler Drivers
    onPageChangeDriver(page: number): void {
        this.pageNumber = page
         this.GetDriversInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
    }

    onPageSizeChangeDriver(size: number): void {
        this.pageSize = size
        this.pageNumber = 1
        this.GetDriversInBranch( this.branchId()!, this.searchTerm, this.pageNumber, this.pageSize)
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
        let columns: any = this.ColsCars.map((d: { field: any }) => {
            return d.field;
        });

        let records = this.allCars();
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
        const filteredCols = this.ColsCars.filter(col => col.title !== 'Action');
        autoTable(doc, {
            head: [filteredCols.map(col => col.title)],
            body: this.allCars().map(car => [car.id, car.carModel, car.carBrand, car.carNumber, car.color, car.plateType, car.carType, car.petrolType, car.isActive]),
        });
        doc.save('branches-list.pdf');
    }

    message1 = this.branchData().iban || 'SA03 8000 0000 6080 1016 7519';
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


    fuelBudge: any;
    savingsInsights: any;
    fuelConsumed: any;
    transactionsToday: any;
    store: any;
    isLoading = true;

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
        this.transactionsToday = {
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
            colors: isDark ? ['#F79320'] : ['#F79320'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#F79320',
                        strokeColor: 'transparent',
                        size: 7,
                    }
                ],
            },
            labels: ['Sat', 'Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri'],
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
                    name: 'Amount',
                    data: [16800, 16800, 15500, 17800, 15500, 17000, 19000],
                }
            ],
        };

        // Balance Statistics
        this.fuelBudge = {
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
            labels: ['Total', 'Budget'],
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
            series: [18250, 25000],
        };

        // Savings Insights
        this.savingsInsights = {
            chart: {
                height: 300,
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

        // Fuel Consumed
        this.fuelConsumed = {
            chart: {
                height: 350,
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
}
