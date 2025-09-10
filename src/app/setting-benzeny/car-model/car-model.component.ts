import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { SettingsService } from 'src/app/service/settings/settings.service';
import { BtnSaveComponent } from 'src/app/shared/btn-save/btn-save.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-model',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnSaveComponent, ReactiveFormsModule, IconModule],
  templateUrl: './car-model.component.html',
  styleUrl: './car-model.component.css'
})
export class CarModelComponent {
    private readonly _SettingsService = inject(SettingsService)

    allModels:WritableSignal<any[]> = signal([])
    modelName:string = ''
    modelId:number = 0
    update:boolean = false
    search = '';

    cols = [
        { field: 'title', title: 'Model Name' },
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        this.GetAllCarModels()
    }

    GetAllCarModels():void{
        this._SettingsService.GetAllCarModels().subscribe({
            next:(res)=>{
                this.allModels.set(res.data)
            }
        })
    }

    submitModelForm():void{
        let data = {
            title: this.modelName
        }

        this._SettingsService.CreateCarModels(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Model Is successfully',
                    padding: '10px 20px',
                });
                this.modelName = ''
                this.GetAllCarModels()
            }
        })
    }

    patchDataModel(model:any):void{
        this.modelId = model.id
        this.modelName = model.title
        this.update = true
    }

    updateModel():void{
        let data = {
            id: this.modelId,
            title :this.modelName
        }

        this._SettingsService.UpdateCarModels(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Model Is successfully',
                    padding: '10px 20px',
                });
                this.modelName = ''
                this.GetAllCarModels()
                this.update = false
            }
        })

    }

    DeleteCarModel(modelId:number):void{
        this._SettingsService.DeleteCarModel(modelId).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Model Is successfully',
                    padding: '10px 20px',
                });
                this.GetAllCarModels()
            }
        })
    }
}
