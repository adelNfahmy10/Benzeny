import { Component, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { BtnAddComponent } from "../shared/btn-add/btn-add.component";
import { DataTableModule } from "@bhplugin/ng-datatable";
import { NgxCustomModalComponent } from "ngx-custom-modal";
import { AdsService } from '../service/ads/ads.service';
import { BtnSaveComponent } from "../shared/btn-save/btn-save.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from "../shared/icon/icon.module";
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [BtnAddComponent, DataTableModule, NgxCustomModalComponent, BtnSaveComponent, FormsModule, IconModule, NgClass, ReactiveFormsModule],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.css'
})
export class AdsComponent implements OnInit{
    private readonly _AdsService = inject(AdsService)
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _lightbox = inject(Lightbox)
    private readonly _lightboxConfig = inject(LightboxConfig)

    mainRole = localStorage.getItem('roles')?.split(',').map(r => r.trim()) || [];
    role:WritableSignal<string | null> = signal(localStorage.getItem('roles'))
    allAds:WritableSignal<any[]> = signal([])
    allAdsSystem:WritableSignal<any[]> = signal([])
    allAdsMobile:WritableSignal<any[]> = signal([])
    totalAds:WritableSignal<number> = signal(0)
    totalAdsActive:WritableSignal<number> = signal(0)
    totalAdsDeActive:WritableSignal<number> = signal(0)
    totalSystemAds:WritableSignal<number> = signal(0)
    totalMobileAds:WritableSignal<number> = signal(0)
    searchTerm:string = ''
    selectedImage: string | null = null;
    adById:any = {}
    adsId:string = ''
    allcontrols = true;
    update:boolean = false

    cols = [
        { field: 'image', title: 'Image' },
        { field: 'name', title: 'Name' },
        { field: 'description', title: 'Description' },
        { field: 'type', title: 'Type' },
        { field: 'durationInMonths', title: 'Duration' },
        { field: 'url', title: 'Url' },
        { field: 'isActive', title: 'Status'},
        { field: 'action', title: 'Action', sort: false },
    ];

    ngOnInit(): void {
        if(this.role() != 'Benzeny'){
            this.getAllAds()
        }
        if(this.role() != 'Benzeny'){
            this.GetAllSystemAds()
            this.bindFancybox();

            this._lightboxConfig.enableTransition = false;
            this._lightboxConfig.wrapAround = true;
            this._lightboxConfig.positionFromTop = 0;
            this._lightboxConfig.disableScrolling = true;
        }
    }


    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            this.adsForm.get('Image')?.setValue(input.files[0])
            reader.onload = () => {
                this.selectedImage = reader.result as string;
            };

            reader.readAsDataURL(file);
        }
    }

    getAllAds():void{
        this._AdsService.GetAllAds().subscribe({
            next:(res)=>{
                this.allAds.set(res.data.items)
                this.totalAds.set(res.data.totalAds)
                this.totalAdsActive.set(res.data.totalAdsActive)
                this.totalAdsDeActive.set(res.data.totalAdsDeActive)
                this.totalSystemAds.set(res.data.totalSystemAds)
                this.totalMobileAds.set(res.data.totalMobileAds)
            }
        })
    }

    GetAllSystemAds():void{
        this._AdsService.GetAllSystemAds().subscribe({
            next:(res)=>{
                this.allAds.set(res.data.items.map((item: any) => ({
                    src: item.image,
                    caption: item.description,
                    link: item.url
                })))
            }
        })
    }

    GetAllMobileAds():void{
        this._AdsService.GetAllMobileAds().subscribe({
            next:(res)=>{
                this.allAds.set(res.data.items)
            }
        })
    }

    GetAllActiveAds():void{
        this._AdsService.GetAllActiveAds().subscribe({
            next:(res)=>{
                this.allAds.set(res.data.items)
            }
        })
    }

    switchAds(event: Event): void {
        let id = Number((event.target as HTMLSelectElement).value);
        if (id === 1) {
            this.getAllAds();
        } else if (id === 2) {
            this.GetAllSystemAds();
        } else if( id === 3){
            this.GetAllMobileAds();
        } else if( id === 4){
            this.GetAllActiveAds();
        }
    }

    adsForm:FormGroup = this._FormBuilder.group({
        Name: [null],
        Image: [null],
        Url: [null],
        Description: [null],
        Type: [1],
        DurationInMonths: [null],
        Latitude: [null],
        Longitude: [null],
    })

    submitAdsForm():void{
        let data = this.adsForm.value
        let formData = new FormData()
        formData.append('Name', data.Name)
        formData.append('Image', data.Image)
        formData.append('Url', data.Url)
        formData.append('Description', data.Description)
        formData.append('Type', data.Type)
        formData.append('DurationInMonths', data.DurationInMonths)
        formData.append('Latitude', data.Latitude)
        formData.append('Longitude', data.Longitude)

        this._AdsService.CreateAds(formData).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Create Ads Is successfully',
                    padding: '10px 20px',
                });

                this.getAllAds()
                this.adsForm.reset()
                this.selectedImage = null
            }
        })
    }

    deleteAds(id:string):void{
        this._AdsService.DeleteAds(id).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Delete Ads successfully',
                    padding: '10px 20px',
                });
                this.getAllAds()
            }
        })
    }

    patchAdsData(ads:any):void{
        this.openModal()
        this.adById = ads
        console.log(this.adById);

        this.adsId = ads.id
        this.update = true
        this.adsForm.patchValue({
            Type: this.adById.typeId,
            Name: this.adById.name,
            Url: this.adById.url,
            Description: this.adById.description,
            DurationInMonths: this.adById.durationInMonths,
            Latitude: this.adById.latitude,
            Longitude: this.adById.longitude,
            Image: this.adById.image
        })
    }

    updateAdsForm():void{
        let data = this.adsForm.value
        let formData = new FormData()
        formData.append('Id', this.adsId)
        formData.append('Name', data.Name)
        formData.append('Image', data.Image)
        formData.append('Url', data.Url)
        formData.append('Description', data.Description)
        formData.append('Type', data.Type)
        formData.append('DurationInMonths', data.DurationInMonths)
        formData.append('Latitude', data.Latitude)
        formData.append('Longitude', data.Longitude)

        this._AdsService.UpdateAds(this.adsId, formData).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Update Ad Is successfully',
                    padding: '10px 20px',
                });

                this.getAllAds()
                this.adsForm.reset()
                this.selectedImage = null
                this.adById.image = null
                this.update = false
            }
        })
    }

    switchAdsActive(id:string):void{
        this._AdsService.SwitchActive(id).subscribe({
            next:(res)=>{
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Switch Ads Activate successfully',
                    padding: '10px 20px',
                });
                this.getAllAds()
            }
        })
    }

    @ViewChild('modal5') modal5: any;
    openModal():void{
        this.adsForm.reset()
        this.modal5.open()
        this.selectedImage = null
        this.adById.image = null
    }

    bindFancybox() {
        if (this.allcontrols) {
            this._lightboxConfig.showImageNumberLabel = true;
            this._lightboxConfig.showZoom = true;
            this._lightboxConfig.showRotate = true;
            this._lightboxConfig.albumLabel = '%1 of %2';
        } else {
            this._lightboxConfig.showImageNumberLabel = false;
            this._lightboxConfig.showZoom = false;
            this._lightboxConfig.showRotate = false;
            this._lightboxConfig.albumLabel = '';
        }
    }

    open(index: number): void {
        this._lightbox.open(this.allAds(), index);
    }
}
