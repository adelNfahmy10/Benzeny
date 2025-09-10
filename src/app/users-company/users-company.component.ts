import { Component, inject, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, NgDataTableComponent } from '@bhplugin/ng-datatable';
import { UserService } from '../service/users/user.service';
import { RolesService } from '../service/roles/roles.service';
import { IconModule } from '../shared/icon/icon.module';
import { BtnSaveComponent } from "../shared/btn-save/btn-save.component";
import { SharedModule } from 'src/shared.module';
import { BtnAddComponent } from "../shared/btn-add/btn-add.component";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-users-company',
  standalone: true,
  imports: [DataTableModule, FormsModule, IconModule, ReactiveFormsModule, BtnSaveComponent, SharedModule, BtnAddComponent, NgClass],
  templateUrl: './users-company.component.html',
  styleUrl: './users-company.component.css'
})
export class UsersCompanyComponent {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _RolesService = inject(RolesService)
    private readonly _UserService = inject(UserService)

    @ViewChild('table') table!:NgDataTableComponent
    companyId:WritableSignal<string | null> = signal(localStorage.getItem('companyId'))
    allRoles:WritableSignal<any[]> = signal([])
    selectedRoles:WritableSignal<any[]> = signal([])
    allUsers:WritableSignal<any[]> = signal([])
    totalUsers:WritableSignal<number> = signal(0)
    totalUsersActive:WritableSignal<number> = signal(0)
    totalUsersDeActive:WritableSignal<number> = signal(0)
    search = '';
    datatable2Cols = [
        { field: 'fullName', title: 'Full Name' },
        { field: 'email', title: 'Email' },
        { field: 'mobile', title: 'Phone No.' },
        { field: 'userRoles', title: 'Roles' },
        { field: 'isActive', title: 'Status'},
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        this.getAllRoles()
        this.getAllUsers()
    }

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

    getAllRoles():void{
        this._RolesService.GetAllRoles().subscribe({
            next:(res)=>{
                this.allRoles.set(res.data)
            }
        })
    }

    toggleRoleSelection(role: any, event: any) {
        this.selectedRoles.update(roles =>
            event.target.checked ? roles.includes(role.id) ? roles : [...roles, role.id] : roles.filter(r => r !== role.id)
        );
    }

    // Form User To Create
    userForm:FormGroup = this._FormBuilder.group({
        companyId:[''],
        fullName:[''],
        email:[''],
        mobile:[''],
        roleIds: this._FormBuilder.array([]),
    })

    /* Submit User Form */
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
            this.userForm.reset()
            this.getAllUsers();
            this.selectedRoles.set([])
        });
    }

    /* Delete User */
    deleteUser(userId:any):void{
        this._UserService.DeleteUser(userId).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete User Is successfully',
                    padding: '10px 20px',
                });
                this.getAllUsers()
            }
        })
    }

    /* Update User */
    patchUserValue(user:any):void{
        this.userForm.patchValue(user);
    }

    updateUser(userId:string):void{
        // this._UsersService.SwitchActiveUser(userId).subscribe(res => {
        //     this._ToastrService.success(res.msg);
        //     this.getAllUsersByCompanyId();
        // });
    }

    /* Switch User Active */
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
                title: 'Create User Is successfully',
                padding: '10px 20px',
            });
            this.getAllUsers();
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

        let records = this.allUsers();
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
            body: this.allUsers().map(user => [user.id, user.fullName, user.email, user.mobile, user.userRoles, user.status]),
        });
        doc.save('users-list.pdf');
    }
}
