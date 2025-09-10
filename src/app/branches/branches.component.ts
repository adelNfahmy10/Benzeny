import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { BranchService } from '../service/branches/branch.service';
import { NgDataTableComponent, DataTableModule } from '@bhplugin/ng-datatable';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BtnSaveComponent } from "../shared/btn-save/btn-save.component";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgClass, NgFor } from '@angular/common';
import { RegionandcityService } from '../service/region-city/regionandcity.service';
import { UserService } from '../service/users/user.service';
import { BtnAddComponent } from "../shared/btn-add/btn-add.component";
import { IconModule } from '../shared/icon/icon.module';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [BtnSaveComponent, ReactiveFormsModule, FormsModule, NgClass, NgFor, BtnAddComponent, IconModule, DataTableModule, SharedModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BranchesComponent implements OnInit{
    private readonly _BranchService = inject(BranchService)
    private readonly _RegionandcityService = inject(RegionandcityService)
    private readonly _UserService = inject(UserService)
    private readonly _FormBuilder = inject(FormBuilder)

    @ViewChild('table') table!:NgDataTableComponent
    companyId:WritableSignal<string | null> = signal(localStorage.getItem('companyId'))
    allRegions:WritableSignal<any[]> = signal([])
    allCities:WritableSignal<any[]> = signal([])
    allUsers:WritableSignal<any[]> = signal([])
    allBranches:WritableSignal<any[]> = signal([])
    totalBranches:WritableSignal<number> = signal(0)
    totalBranchsActive:WritableSignal<number> = signal(0)
    totalBranchsDeActive:WritableSignal<number> = signal(0)
    branchDataById:any
    branchId:any
    regionId!:any
    pageNumber:number = 1
    pageSize:number = 100
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

    // Get Run Methods
    ngOnInit(): void {
        this.getAllBranches()
        this.getAllUsers()
        this.getAllRegion()
        this.addUser()
    }

    // Get All Branches
    getAllBranches(pageNumber:number = 1, pageSize:number = 100, searchTerm:string = ''):void{
        this._BranchService.GetAllBranchesByCompanyId(this.companyId()!, pageNumber, pageSize, searchTerm).subscribe({
            next:(res)=>{
                this.allBranches.set(res.data.items)
                this.totalBranches.set(res.data.totalCount)
                this.totalBranchsActive.set(res.data.activeCount)
                this.totalBranchsDeActive.set(res.data.inActiveCount)
            }
        })
    }

    // Get Run Methods
    getAllUsers():void{
        this._UserService.GetAllUsersByCompanyId(this.companyId()!).subscribe({
            next:(res)=>{
                this.allUsers.set(res.data.users)
            }
        })
    }

    // Get All Region
    getAllRegion():void{
        this._RegionandcityService.GetAllRegions().subscribe({
            next:(res)=>{
                this.allRegions.set(res.data.items)
            }
        })
    }

    onRegionsChange(event:Event):void{
        this.regionId = (event.target as HTMLSelectElement).value
        this.getAllCity(this.regionId)
    }

    // Get All City By RegionId
    getAllCity(regionId:string):void{
        this._RegionandcityService.GetAllCity(regionId).subscribe({
            next:(res)=>{
                this.allCities.set(res.data)
            }
        })
    }

    // Form Create Branch
    branchForm:FormGroup = this._FormBuilder.group({
        CompanyId:[''],
        Address:[''],
        PhoneNumber:[''],
        RegionId: [''],
        CityId: [''],
        UserIds: this._FormBuilder.array([])
    })

    // Add New User To Branch
    get users():FormArray {
        return this.branchForm.get('UserIds') as FormArray;
    }
    addUser(){
        const userControl = this._FormBuilder.control('');
        this.users.push(userControl);
    }
    removeUser(index: number) {
        this.users.removeAt(index);
    }

    // Submit Branch
    submitBranchForm():void{
        let data = this.branchForm.value
        data.CompanyId = this.companyId()

        let formData = new FormData()
        formData.append('CompanyId', data.CompanyId)
        formData.append('Address', data.Address)
        formData.append('PhoneNumber', data.PhoneNumber)
        formData.append('RegionId', data.RegionId)
        formData.append('CityId', data.CityId)
        data.UserIds.forEach((user:any) => {
            formData.append(`UserIds`, user)
        });

        this._BranchService.CreateBranch(formData).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Branch Is successfully',
                    padding: '10px 20px',
                });
                this.getAllBranches()
                this.branchForm.reset()
                this.users.clear()
                this.addUser()
            }
        })
    }

    // Delete Branch
    deleteBranch(id:any):void{
        this._BranchService.DeleteBranch(id).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Branch Is successfully',
                    padding: '10px 20px',
                });
                this.getAllBranches()
            }
        })
    }

    // Form update Branch
    updateBranchForm:FormGroup = this._FormBuilder.group({
        address:[''],
        regionId:[''],
        cityId: [''],
    })

    // Patch Branch Data
    patchBranchData(id:any):void{
        this.branchId = id
        this._BranchService.GetBranchById(id).subscribe({
            next:(res)=>{
                this.branchDataById = res.data
                console.log(this.branchDataById);
                let data = {
                    branchId : res.data.id,
                    address : res.data.address,
                    regionId : res.data.regionId,
                    cityId : res.data.cityId
                }
                this.getAllCity(data.regionId)
                this.updateBranchForm.patchValue(data)
            }
        })
    }

    // Update Branch
    updateBranch():void{
        let data = this.updateBranchForm.value
        this._BranchService.UpdateCompany(this.branchId, data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Branch Is successfully',
                    padding: '10px 20px',
                });
                this.getAllBranches()
                this.updateBranchForm.reset()
            }
        })
    }

    // Search Data
    searchBranch(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.getAllBranches(this.pageNumber, this.pageSize, this.searchTerm)
    }

    // Pagination Handler
    onPageChange(page: number): void {
        this.pageNumber = page
        this.getAllBranches(this.pageNumber, this.pageSize, this.searchTerm)
    }

    onPageSizeChange(size: number): void {
        this.pageSize = size
        this.pageNumber = 1
        this.getAllBranches(this.pageNumber, this.pageSize, this.searchTerm)
    }

    /* Switch Branch Active */
    switchActiveBranch(branchId:string):void{
        this._BranchService.SwitchActiveBranch(branchId).subscribe(res => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                title: 'Switch Branch Activate Is successfully',
                padding: '10px 20px',
            });
            this.getAllBranches();
        });
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
}
