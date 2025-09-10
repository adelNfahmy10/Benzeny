import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { SettingsService } from 'src/app/service/settings/settings.service';
import { BtnSaveComponent } from 'src/app/shared/btn-save/btn-save.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [DataTableModule, FormsModule, BtnSaveComponent, ReactiveFormsModule, IconModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {
private readonly _SettingsService = inject(SettingsService)

    allTags:WritableSignal<any[]> = signal([])
    tagName:string = ''
    tagId:number = 0
    update:boolean = false
    search = '';

    cols = [
        { field: 'title', title: 'Type Name' },
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        this.GetAllTags()
    }

    GetAllTags():void{
        this._SettingsService.GetAllTags().subscribe({
            next:(res)=>{
                this.allTags.set(res.data)
            }
        })
    }

    submitTagForm():void{
        let data = {
            title: this.tagName
        }

        this._SettingsService.CreateTags(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Tag Is successfully',
                    padding: '10px 20px',
                });
                this.tagName = ''
                this.GetAllTags()
            }
        })
    }

    patchDataTag(tag:any):void{
        this.tagId = tag.id
        this.tagName = tag.title
        this.update = true
    }

    updateTag():void{
        let data = {
            id: this.tagId,
            title :this.tagName
        }

        this._SettingsService.UpdateTags(data).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Tag Is successfully',
                    padding: '10px 20px',
                });
                this.tagName = ''
                this.GetAllTags()
                this.update = false
            }
        })

    }

    DeleteTags(tagId:number):void{
        this._SettingsService.DeleteTags(tagId).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Tag Is successfully',
                    padding: '10px 20px',
                });
                this.GetAllTags()
            }
        })
    }
}
