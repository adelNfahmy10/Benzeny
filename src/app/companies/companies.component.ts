import { isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconModule } from "../shared/icon/icon.module";
import { SharedModule } from 'src/shared.module';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../service/roles/roles.service';
import { UserService } from '../service/users/user.service';
import { BtnSaveComponent } from "../shared/btn-save/btn-save.component";
import { BtnViewComponent } from "../shared/btn-view/btn-view.component";
import { BtnAddComponent } from "../shared/btn-add/btn-add.component";
import Swal from 'sweetalert2';
import { BranchService } from '../service/branches/branch.service';
import { RegionandcityService } from '../service/region-city/regionandcity.service';
import { CompaniesService } from '../service/companies/companies.service';
import { map } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [RouterLink, NgClass, IconModule, SharedModule, FormsModule, ReactiveFormsModule, BtnSaveComponent, BtnViewComponent, BtnAddComponent, NgFor],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent implements OnInit{
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _RolesService = inject(RolesService)
    private readonly _UserService = inject(UserService)
    private readonly _BranchService = inject(BranchService)
    private readonly _RegionandcityService = inject(RegionandcityService)
    private readonly _CompaniesService = inject(CompaniesService)

    mainRole = localStorage.getItem('roles')?.split(',').map(r => r.trim()) || [];
    companyId:WritableSignal<string | null> = signal(localStorage.getItem('companyId') || null)
    companyName:WritableSignal<string | null> = signal(localStorage.getItem('companyName') || null)
    role:WritableSignal<string | null> = signal(localStorage.getItem('role'))
    companyLogo:any = ''
    allRoles:WritableSignal<any[]> = signal([])
    allRegions:WritableSignal<any[]> = signal([])
    allCities:WritableSignal<any[]> = signal([])
    selectedRoles:WritableSignal<any[]> = signal([])
    allUsers:WritableSignal<any[]> = signal([])
    totalUsers:WritableSignal<number> = signal(0)
    totalUsersActive:WritableSignal<number> = signal(0)
    totalUsersDeActive:WritableSignal<number> = signal(0)
    allBranches:WritableSignal<any[]> = signal([])
    totalBranches:WritableSignal<number> = signal(0)
    totalBranchsActive:WritableSignal<number> = signal(0)
    totalBranchsDeActive:WritableSignal<number> = signal(0)

    allCompanies:WritableSignal<any[]> = signal([])
    totalCompanies:WritableSignal<number> = signal(0)
    totalActiveCompanies:WritableSignal<number> = signal(0)
    totalDeActiveCompanies:WritableSignal<number> = signal(0)
    searchTerm:string = ''
    pageNumber:number = 1
    pageSize:number = 10
    cols = [
        { field: 'profilePicturePath', title: 'Logo' },
        { field: 'name', title: 'Company' },
        { field: 'companyEmail', title: 'Email' },
        { field: 'companyPhone', title: 'Phone No.' },
        { field: 'description', title: 'Description' },
        { field: 'iban', title: 'IBAN' },
        { field: 'isActive', title: 'Status' },
        { field: 'action', title: 'Action', sort: false },
    ];

    // Get Run Methods
    ngOnInit(): void {
        this.getAllRoles()
        this.getAllRegion()
        this.addUser()
        this.getAllCompanies()
        if(this.companyId()){
            this.getCompanyLogo()
            this.getAllBranches()
            this.getAllUsers()
        }
    }

    // Get All Companies
    getAllCompanies(pageNumber:number = 1, pageSize:number = 10, searchTerm:string = ''):void{
        this._CompaniesService.GetAllCompanies(pageNumber, pageSize, searchTerm).subscribe({
            next:(res)=>{
                this.allCompanies.set(res.data.items),
                this.totalCompanies.set(res.data.totalCount)
                this.totalActiveCompanies.set(res.data.activeCount)
                this.totalDeActiveCompanies.set(res.data.inActiveCount)
            }
        })
    }

    // Switch Compnay
    switchActiveCompany(id:string):void{
        this._CompaniesService.CompanySwitchActive(id).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Switch Active Company Is successfully',
                    padding: '10px 20px',
                });
                this.getAllCompanies()
            }
        })
    }

    // Delete Compnay
    deleteCompany(id:string):void{
        this._CompaniesService.DeleteCompany(id).subscribe({
              next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Company Is successfully',
                    padding: '10px 20px',
                });
                this.getAllCompanies()
            }
        })
    }

    // Search Drvier Data
    searchCompany(event:Event):void{
        this.searchTerm = (event.target as HTMLInputElement).value
        this.pageNumber = 1
        this.getAllCompanies(this.pageNumber, this.pageSize,  this.searchTerm)
    }

    // Pagination Handler Companies
    onPageChangeCompany(page: number): void {
        this.pageNumber = page
        this.getAllCompanies(this.pageNumber, this.pageSize,  this.searchTerm)
    }

    onPageSizeChangeCompany(size: number): void {
        this.pageSize = size
        this.pageNumber = 1
        this.getAllCompanies(this.pageNumber, this.pageSize,  this.searchTerm)
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

        let records = this.allCompanies();
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type == 'csv') {
            console.log('test');
            this._CompaniesService.ExportCsv().subscribe({
                next:(res)=>{
                    const blob = new Blob([res], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'companies-list.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            })
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
        }
    }

    downloadPdf() {
        this._CompaniesService.ExportPdf().subscribe({
            next:(res)=>{
                const blob = new Blob([res], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'companies-list.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        })

        // const doc = new jsPDF();
        // const filteredCols = this.cols.filter(col => col.title !== 'Action');
        // autoTable(doc, {
        //     head: [filteredCols.map(col => col.title)],
        //     body: this.allCompanies().map(company => [company.id, company.name, company.companyEmail, company.companyPhone, company.iban, company.description, company.isActive]),
        // });
        // doc.save('companies-list.pdf');
    }

    // Get Logo Compnay
    getCompanyLogo(): void {
         this._CompaniesService.GetCompanyById(this.companyId()!).pipe(map((res) => res.data.profilePicturePath)).subscribe({
            next: (logo) => {
                this.companyLogo = logo;
            }
        });
    }

    // Get All User
    getAllUsers():void{
        this._UserService.GetAllUsersByCompanyId(this.companyId()!).subscribe({
            next:(res)=>{
                this.allUsers.set(res.data.users)
                this.totalUsers.set(res.data.totalCount)
                this.totalUsersActive.set(res.data.activeCount)
                this.totalUsersDeActive.set(res.data.inActiveCount)
            }
        })
    }

    // Get All Branches
    getAllBranches():void{
        this._BranchService.GetAllBranchesByCompanyId(this.companyId()!, 1, 10, '').subscribe({
            next:(res)=>{
                this.allBranches.set(res.data.items)
                this.totalBranches.set(res.data.totalCount)
                this.totalBranchsActive.set(res.data.activeCount)
                this.totalBranchsDeActive.set(res.data.inActiveCount)
            }
        })
    }

    // Get All Role
    getAllRoles():void{
        this._RolesService.GetAllRoles().subscribe({
            next:(res)=>{
                this.allRoles.set(res.data)
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
        let selectedId = (event.target as HTMLSelectElement).value
        this.getAllCity(selectedId)
    }

    // Get All City By RegionId
    getAllCity(regionId:string):void{
        this._RegionandcityService.GetAllCity(regionId).subscribe({
            next:(res)=>{
                this.allCities.set(res.data)
            }
        })
    }

    // Select Roles
    toggleRoleSelection(role: any, event: any) {
        this.selectedRoles.update(roles =>
            event.target.checked ? roles.includes(role.id) ? roles : [...roles, role.id] : roles.filter(r => r !== role.id)
        );
    }

    // Form User
    userForm:FormGroup = this._FormBuilder.group({
        companyId:[''],
        fullName:[''],
        email:[''],
        mobile:[''],
        roleIds: this._FormBuilder.array([]),
    })

    /* Submit UserForm */
    submitUserForm():void{
        let data = this.userForm.value;
        data.companyId = this.companyId();
        data.roleIds = this.selectedRoles();
        this._UserService.CreateUser(data).subscribe(res => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                title: 'Create User Is successfully',
                padding: '10px 20px',
            });
            this.getAllUsers();
            this.selectedRoles.set([])
            this.userForm.reset()
        });
    }

    /* Switch UserActive */
    switchActiveUser(userId:string):void{
        this._UserService.SwitchUserActive(userId).subscribe(res => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                title: 'Switch Active successfully',
                padding: '10px 20px',
            });
            this.getAllUsers();
        });
    }

    /* ################# Branches Methods ################# */

    // Form Branch
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
            }
        })
    }



    message1 = 'SA03 8000 0000 6080 1016 7519';
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
}
