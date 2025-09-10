import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DataTableModule } from "@bhplugin/ng-datatable";
import { BtnAddComponent } from "../shared/btn-add/btn-add.component";
import { IconModule } from "../shared/icon/icon.module";
import { SharedModule } from 'src/shared.module';
import { BtnSaveComponent } from "../shared/btn-save/btn-save.component";
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr';
import { CarService } from '../service/car/car.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgClass } from '@angular/common';
import { SettingsService } from '../service/settings/settings.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnAddComponent, IconModule, SharedModule, BtnSaveComponent, NgClass],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent implements OnInit{
    private readonly _CarService = inject(CarService)
    private readonly _SettingsService = inject(SettingsService)
    private readonly _FormBuilder = inject(FormBuilder)
    basic: FlatpickrDefaultsInterface;
    branchId:WritableSignal<string | null> = signal(localStorage.getItem('branchId'))
    allCars:WritableSignal<any[]> = signal([])
    allBrands:WritableSignal<any[]> = signal([])
    allModels:WritableSignal<any[]> = signal([])
    allCarTypes:WritableSignal<any[]> = signal([])
    allPlateTypes:WritableSignal<any[]> = signal([])
    totalCars:WritableSignal<number> = signal(0)
    totalActiveCars:WritableSignal<number> = signal(0)
    totalDeActiveCars:WritableSignal<number> = signal(0)
    carId:string = ''
    carDataById:any
    pageNumber:number = 1
    pageSize:number = 100
    searchTerm = '';
    carModelId:string = ''
    carBrandId:string = ''
    carTypeId:string = ''
    plateTypeId:string = ''
    // Car Number
    carNumberEn: string = '';
    carNumberAr: string = '';
    // English letters
    carLetter1: string = '';
    carLetter2: string = '';
    carLetter3: string = '';
    // Arabic letters
    carLetterAr1: string = '';
    carLetterAr2: string = '';
    carLetterAr3: string = '';
    update:boolean = false

    constructor(){
        this.basic = {
            dateFormat: 'Y-m-d',
            // position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
            monthSelectorType: 'dropdown',
        };
    }

    ngOnInit(): void {
        this.getAllCars()
        this.GetAllCarBrands()
        this.GetAllCarModels()
        this.GetAllCarTypes()
        this.GetAllPlateTypes()
    }

    cols = [
        { field: 'carModel', title: 'Car Model' },
        { field: 'carBrand', title: 'Car Brand' },
        { field: 'carType', title: 'Car Type' },
        { field: 'carNumber', title: 'Car Number' },
        { field: 'color', title: 'Car Color' },
        { field: 'plateType', title: 'Plate Type' },
        { field: 'licenseDate', title: 'License Date' },
        { field: 'petrolType', title: 'Petrol Type' },
        { field: 'isActive', title: 'Status' },
        { field: 'action', title: 'Action', sort: false },
    ];

    // Get All Branches
    getAllCars(searchTerm:string = '', pageNumber:number = 1, pageSize:number = 100):void{
        this._CarService.GetAllCarsInBranch(this.branchId()!,searchTerm, pageNumber, pageSize).subscribe({
            next:(res)=>{
                this.allCars.set(res.data.items)
                this.totalCars.set(res.data.totalCount)
                this.totalActiveCars.set(res.data.activeCount)
                this.totalDeActiveCars.set(res.data.inActiveCount)
            }
        })
    }

    GetAllCarBrands():void{
        this._SettingsService.GetAllCarBrands().subscribe({
            next:(res)=>{
                this.allBrands.set(res.data)
            }
        })
    }

    GetAllCarModels():void{
        this._SettingsService.GetAllCarModels().subscribe({
            next:(res)=>{
                this.allModels.set(res.data)
            }
        })
    }

    GetAllCarTypes():void{
        this._SettingsService.GetAllCarTypes().subscribe({
            next:(res)=>{
                this.allCarTypes.set(res.data)
            }
        })
    }

    GetAllPlateTypes():void{
        this._SettingsService.GetAllPlateTypes().subscribe({
            next:(res)=>{
                this.allPlateTypes.set(res.data)
            }
        })
    }

    // Search Data
    searchCar(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.getAllCars(this.searchTerm, this.pageNumber, this.pageSize)
    }

    // Get All Form Select IDs
    onCarModelChange(event:Event):void{
        this.carModelId = (event.target as HTMLSelectElement).value
    }

    onCarBrandChange(event:Event):void{
        this.carBrandId = (event.target as HTMLSelectElement).value
    }

    onCarTypeChange(event:Event):void{
        this.carTypeId = (event.target as HTMLSelectElement).value
    }

    onPlateTypeChange(event:Event):void{
        this.plateTypeId = (event.target as HTMLSelectElement).value
    }

    @ViewChild('modal5') modal5: any;
    openModel():void{
        this.modal5.open()
        this.carForm.reset()
        this.update = false
    }

    // Form Create Car
    carForm:FormGroup = this._FormBuilder.group({
        branchId: [null],
        carModelId: [null],
        carBrandId: [null],
        plateTypeId: [null],
        carTypeId: [null],
        carNumber: [null],
        color: [null],
        licenseDate: [null],
        petrolType: [null],
    })

    // Submit Car Form
    submitCarForm():void{
        let data = this.carForm.value
        data.carNumber = this.carNumberEn + " "  + this.carLetter1.toUpperCase() + this.carLetter2.toUpperCase()  + this.carLetter3.toUpperCase() + " / " + this.carNumberAr + " " + this.carLetterAr1.toUpperCase() + " " + this.carLetterAr2.toUpperCase() + " " + this.carLetterAr3.toUpperCase()
        data.branchId = this.branchId()
        this._CarService.CreateCar(data).subscribe({
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
                this.getAllCars()
                this.carForm.reset()
                this.carNumberEn = '';
                this.carNumberAr = '';
                this.carLetter1 = '';
                this.carLetter2 = '';
                this.carLetter3 = '';
                this.carLetterAr1 = '';
                this.carLetterAr2 = '';
                this.carLetterAr3 = '';
            }
        })
    }

    // Delete Car
    deleteCar(id:string):void{
        this._CarService.DeleteCar(id).subscribe({
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
                this.getAllCars()
            }
        })
    }

    switchActiveCar(carId:string):void{
         this._CarService.CarSwitchActive(carId).subscribe(res => {
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
            this.getAllCars();
        });
    }

    // Patch Branch Data
    patchBranchData(id:any):void{
        this.carId = id
        this._CarService.GetCarById(id).subscribe({
            next:(res)=>{
                this.carDataById = res.data
                this.carForm.patchValue(this.carDataById)
                this.update = true
            }
        })
    }

    updateCarForm():void{
        this.update = false
        let data = this.carForm.value
        if(this.carNumberEn &&
            this.carLetter1 &&
            this.carLetter2 &&
            this.carLetter3 &&
            this.carNumberAr &&
            this.carLetterAr1 &&
            this.carLetterAr2 &&
            this.carLetterAr3){
            data.carNumber = this.carNumberEn + " "  + this.carLetter1.toUpperCase() + this.carLetter2.toUpperCase() + this.carLetter3.toUpperCase() + " / " + this.carNumberAr + " " + this.carLetterAr1.toUpperCase() + " " + this.carLetterAr2.toUpperCase() + " " + this.carLetterAr3.toUpperCase()
        } else {
            data.carNumber = null
        }
        data.id = this.carId

        this._CarService.UpdateCar(this.carId, data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Vehicle Is successfully',
                    padding: '10px 20px',
                });
                this.getAllCars();
                this.carForm.reset()
                this.carNumberEn = '';
                this.carNumberAr = '';
                this.carLetter1 = '';
                this.carLetter2 = '';
                this.carLetter3 = '';
                this.carLetterAr1 = '';
                this.carLetterAr2 = '';
                this.carLetterAr3 = '';
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
        let columns: any = this.cols.map((d: { field: any }) => {
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
        const filteredCols = this.cols.filter(col => col.title !== 'Action');
        autoTable(doc, {
            head: [filteredCols.map(col => col.title)],
            body: this.allCars().map(car => [car.id, car.carModel, car.carBrand, car.carType, car.carNumber, car.color, car.plateType, car.licenseDate, car.petrolType]),
        });
        doc.save('cares-list.pdf');
    }
}
