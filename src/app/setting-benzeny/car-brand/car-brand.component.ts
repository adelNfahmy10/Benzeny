import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "@bhplugin/ng-datatable";
import { SettingsService } from 'src/app/service/settings/settings.service';
import { BtnSaveComponent } from "src/app/shared/btn-save/btn-save.component";
import { IconModule } from "src/app/shared/icon/icon.module";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-brand',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnSaveComponent, ReactiveFormsModule, IconModule],
  templateUrl: './car-brand.component.html',
  styleUrl: './car-brand.component.css'
})
export class CarBrandComponent implements OnInit{
    private readonly _SettingsService = inject(SettingsService)

    allBrands:WritableSignal<any[]> = signal([])
    brandName:string = ''
    brandId:number = 0
    update:boolean = false
    search = '';

    cols = [
        { field: 'title', title: 'Brand Name' },
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        this.getAllBrands()
    }

    getAllBrands():void{
        this._SettingsService.GetAllCarBrands().subscribe({
            next:(res)=>{
                this.allBrands.set(res.data)
            }
        })
    }

    submitBrandForm():void{
        let data = {
            title: this.brandName
        }

        this._SettingsService.CreateCarBrands(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Brand Is successfully',
                    padding: '10px 20px',
                });
                this.brandName = ''
                this.getAllBrands()
            }
        })
    }

    patchDataBrand(brand:any):void{
        this.brandId = brand.id
        this.brandName = brand.title
        this.update = true
    }

    updateBrand():void{
        let data = {
            id: this.brandId,
            title :this.brandName
        }

        this._SettingsService.UpdateCarBrands(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Brand Is successfully',
                    padding: '10px 20px',
                });
                this.brandName = ''
                this.getAllBrands()
                this.update = false
            }
        })

    }

    deleteBrand(brandId:number):void{
        this._SettingsService.DeleteCarBrands(brandId).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Brand Is successfully',
                    padding: '10px 20px',
                });
                this.getAllBrands()
            }
        })
    }
}
