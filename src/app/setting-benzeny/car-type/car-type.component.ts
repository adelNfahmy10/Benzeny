import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { SettingsService } from 'src/app/service/settings/settings.service';
import { BtnSaveComponent } from 'src/app/shared/btn-save/btn-save.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-type',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnSaveComponent, ReactiveFormsModule, IconModule],
  templateUrl: './car-type.component.html',
  styleUrl: './car-type.component.css'
})
export class CarTypeComponent {
    private readonly _SettingsService = inject(SettingsService)

    allTypes:WritableSignal<any[]> = signal([])
    typeName:string = ''
    typeId:number = 0
    update:boolean = false
    search = '';

    cols = [
        { field: 'title', title: 'Type Name' },
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        this.GetAllCarTypes()
    }

    GetAllCarTypes():void{
        this._SettingsService.GetAllCarTypes().subscribe({
            next:(res)=>{
                this.allTypes.set(res.data)
            }
        })
    }

    submitTypeForm():void{
        let data = {
            title: this.typeName
        }

        this._SettingsService.CreateCarTypes(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Type Is successfully',
                    padding: '10px 20px',
                });
                this.typeName = ''
                this.GetAllCarTypes()
            }
        })
    }

    patchDataType(type:any):void{
        this.typeId = type.id
        this.typeName = type.title
        this.update = true
    }

    updateType():void{
        let data = {
            id: this.typeId,
            title :this.typeName
        }

        this._SettingsService.UpdateCarTypes(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Type Is successfully',
                    padding: '10px 20px',
                });
                this.typeName = ''
                this.GetAllCarTypes()
                this.update = false
            }
        })

    }

    DeleteCarTypes(typeId:number):void{
        this._SettingsService.DeleteCarTypes(typeId).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Type Is successfully',
                    padding: '10px 20px',
                });
                this.GetAllCarTypes()
            }
        })
    }
}
