import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { SettingsService } from '../service/settings/settings.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgClass } from '@angular/common';
import { BtnSaveComponent } from '../shared/btn-save/btn-save.component';
import { SharedModule } from 'src/shared.module';
import { IconModule } from '../shared/icon/icon.module';
import { BtnAddComponent } from '../shared/btn-add/btn-add.component';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { DriverService } from '../service/driver/driver.service';
import { CarService } from '../service/car/car.service';
import { RolesService } from '../service/roles/roles.service';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnAddComponent, IconModule, SharedModule, BtnSaveComponent, FormsModule, NgClass],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent {
    private readonly _DriverService = inject(DriverService)
    private readonly _CarService = inject(CarService)
    private readonly _RolesService = inject(RolesService)
    private readonly _SettingsService = inject(SettingsService)
    private readonly _FormBuilder = inject(FormBuilder)
    branchId:WritableSignal<string | null> = signal(localStorage.getItem('branchId'))
    allDrivers:WritableSignal<any[]> = signal([])
    allCars:WritableSignal<any[]> = signal([])
    allTags:WritableSignal<any[]> = signal([])
    tagId:string = ''
    selectedDays:WritableSignal<any[]> = signal([])
    allDays:WritableSignal<any[]> = signal([
        {
            id: 1,
            day: 'SAT',
        },
        {
            id: 2,
            day: 'SUN',
        },
        {
            id: 3,
            day: 'MON',
        },
        {
            id: 4,
            day: 'TUS',
        },
        {
            id: 5,
            day: 'WED',
        },
        {
            id: 6,
            day: 'THU',
        },
        {
            id: 7,
            day: 'FRI',
        }
    ])
    totalDrivers:WritableSignal<number> = signal(0)
    totalActiveDrivers:WritableSignal<number> = signal(0)
    totalDeActiveDrivers:WritableSignal<number> = signal(0)
    driverId:string = ''
    driverDataById:any
    pageNumber:number = 1
    pageSize:number = 100
    searchTerm = '';
    update:boolean = false
    selectDriverToBalance: string[] = []
    selectTransaction: any = 0
    transactionTypes:any[] = [
        {
            id: 1,
            transaction: 'This Time Only',
        },
        {
            id: 2,
            transaction: 'Set Vehicles Limit',
        }
    ]
    limitTypes:any[] = [
        {
            id: 1,
            limit: 'Daily',
        },
        {
            id: 2,
            limit: 'Weekly',
        },
        {
            id: 3,
            limit: 'Monthly',
        }
    ]

    ngOnInit(): void {
        this.getAllDrivers()
        this.getAllTags()
        this.getAllCars()
    }

    cols = [
        { field: 'fullName', title: 'Driver Name' },
        { field: 'phoneNumber', title: 'Phone No.' },
        { field: 'tagName', title: 'Tags' },
        // { field: 'cardStatus', title: 'Card Status' },
        { field: 'consumptionType', title: 'Consumption Type' },
        { field: 'balance', title: 'Current Balance' },
        { field: 'refund', title: 'Refund Balance' },
        { field: 'isActive', title: 'Status' },
        { field: 'assign', title: 'Assign' },
        { field: 'carPlate', title: 'Car Plate' },
        { field: 'action', title: 'Action', sort: false },
    ];

    // Get All Drivers
    getAllDrivers( searchTerm:string = '', pageNumber:number = 1, pageSize:number = 100):void{
        this._DriverService.GetDriversInBranch(this.branchId()!,searchTerm, pageNumber, pageSize).subscribe({
            next:(res)=>{
                this.allDrivers.set(res.data.items)
                this.totalDrivers.set(res.data.totalCount)
                this.totalActiveDrivers.set(res.data.activeCount)
                this.totalDeActiveDrivers.set(res.data.inActiveCount)
            }
        })
    }

    // Get All Cars
    getAllCars( searchTerm:string = '', pageNumber:number = 1, pageSize:number = 100):void{
        this._CarService.GetAllCarsInBranch(this.branchId()!,searchTerm, pageNumber, 500).subscribe({
            next:(res)=>{
                this.allCars.set(res.data.items)
            }
        })
    }

    // Get All Tags
    getAllTags():void{
        this._SettingsService.GetAllTags().subscribe({
            next:(res)=>{
                this.allTags.set(res.data)
            }
        })
    }

    // Get All Tag Id
    onCarModelChange(event:Event):void{
        this.tagId = (event.target as HTMLSelectElement).value
        console.log(this.tagId);

    }

        // Select Days
    toggleRoleSelection(role: any, event: any) {
        this.selectedDays.update(roles =>
            event.target.checked ? roles.includes(role.id) ? roles : [...roles, role.id] : roles.filter(r => r !== role.id)
        );
    }

    // Search Data
    searchDriver(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.getAllDrivers(this.searchTerm, this.pageNumber, this.pageSize)
    }

    // Form Create Car
    driverForm:FormGroup = this._FormBuilder.group({
        branchId: [''],
        fullName: [''],
        phoneNumber: [''],
        tagId: [''],
        license: [''],
        licenseDegree: [''],
    })

    // Submit Car Form
    submitDriverForm():void{
        let data = this.driverForm.value
        data.branchId = this.branchId()
        this._DriverService.CreateDriver(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Vehicle Is successfully',
                    padding: '10px 20px',
                });
                this.getAllDrivers()
                this.driverForm.reset()
            }
        })
    }

    // Delete Car
    deleteDriver(id:string):void{
        this._DriverService.DeleteDriver(id).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Vehicle Is successfully',
                    padding: '10px 20px',
                });
                this.getAllDrivers()
            }
        })
    }

    switchActiveDriver(driverId:string):void{
         this._DriverService.DriverSwitchActive(driverId).subscribe(res => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                title: 'Switch Vehicle Activate Is successfully',
                padding: '10px 20px',
            });
            this.getAllDrivers();
        });
    }

    // Patch Branch Data
    // patchBranchData(id:any):void{
    //     this.driverId = id
    //     this._DriverService.GetDriverById(id).subscribe({
    //         next:(res)=>{
    //             this.driverDataById = res.data
    //             this.driverForm.patchValue(this.driverDataById)
    //             this.update = true
    //         }
    //     })
    // }

    // updatedriverForm():void{
    //     this.update = false
    //     let data = this.driverForm.value
    //     data.id = this.driverId

    //     this._DriverService.UpdateCar(this.driverId, data).subscribe({
    //         next:(res)=>{
    //             const toast = Swal.mixin({
    //                 toast: true,
    //                 position: 'top-end',
    //                 showConfirmButton: false,
    //                 timer: 3000,
    //             });
    //             toast.fire({
    //                 icon: 'success',
    //                 title: 'Update Vehicle Is successfully',
    //                 padding: '10px 20px',
    //             });
    //             this.getAllDrivers();
    //             this.driverForm.reset()
    //         }
    //     })

    // }

    assignToCarForm:FormGroup = this._FormBuilder.group({
        driverId: [''],
        carId: [''],
    })

    submitAssignDriverToCar():void{
        let data = this.assignToCarForm.value
        this._DriverService.AssignDriverToCar(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Assgin Driver To Vehicle Is successfully',
                    padding: '10px 20px',
                });
                this.getAllDrivers()
                this.assignToCarForm.reset()
            }
        })
    }

    unAssingDriverToCar(driverId:string, carId:string):void{
        let data = {
            driverId: driverId,
            carId: carId,
        }

        this._DriverService.UnassignDriverFromCar(data).subscribe({
           next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'UnAssgin Driver To Vehicle Is successfully',
                    padding: '10px 20px',
                });
                this.getAllDrivers()
                this.assignToCarForm.reset()
            }
        })

    }

    addBalanceForm:FormGroup = this._FormBuilder.group({
        driversIds: [''],
        amount:[''],
        transactionType:[''],
        limitType:[null],
        days:[null],
    })

    onDriverSelect(event: any) {
        this.selectDriverToBalance = event.map((row: any) => row.id);
    }

    submitAddBalance():void{
        let data = this.addBalanceForm.value
        data.driversIds = this.selectDriverToBalance

        this._DriverService.DriverAssignFunds(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Add Balance To Driver(s) Successfully',
                    padding: '10px 20px',
                });

                this.addBalanceForm.reset()
                this.getAllDrivers()
            }
        })


    }

    @ViewChild('modal7') modal7: any;
    msgAlertToAddBalance():void{
        if(this.selectDriverToBalance.length === 0){
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'warning',
                title: 'Select Drivers To Add Balance',
                padding: '10px 20px',
            });
        } else{
            this.modal7.open()
        }
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
        let columns: any = this.cols.map((d: { field: any }) => {
            return d.field;
        });

        let records = this.allDrivers();
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
        const filteredCols = this.cols.filter(col => col.title !== 'Action');
        autoTable(doc, {
            head: [filteredCols.map(col => col.title)],
            body: this.allDrivers().map(car => [car.id, car.carModel, car.carBrand, car.carType, car.carNumber, car.color, car.plateType, car.licenseDate, car.petrolType]),
        });
        doc.save('cares-list.pdf');
    }
}
