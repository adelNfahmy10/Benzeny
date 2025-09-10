import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesService } from '../service/companies/companies.service';
import Swal from 'sweetalert2';

@Component({
    templateUrl: './boxed-signup.html',
    animations: [toggleAnimation],
})
export class BoxedSignupComponent implements AfterViewInit, OnInit  {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _CompaniesService = inject(CompaniesService)
    private readonly _ActivatedRoute = inject(ActivatedRoute)
    private readonly _Router = inject(Router)


    activeTab = 1;
    companyId:string | null = null
    companyData:any = {}
    files: any;

    ngOnInit(): void {
        this.contiuneRegister()
        if(this.companyId){
            this.getCompanyById()
        }
    }

    ngAfterViewInit(): void {
        if(!this.companyId){
            this.files  = new FileUploadWithPreview('mySecondImage', {
                images: {
                    baseImage: '/assets/images/file-preview.svg',
                    backgroundImage: '',
                },
                multiple: true,
            });
        }
    }

    imageChangedEvent: Event | null = null;
    croppedImage: SafeUrl  = '';
    filesLogo: File[] = [];

    onSelectLogo(event:any) {
        this.filesLogo.push(...event.addedFiles);
    }
    onRemoveLogo(event:any) {
        this.filesLogo.splice(this.filesLogo.indexOf(event), 1);
    }
    fileChangeEvent(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageBase64 = e.target?.result;
                this.registerForm.get('CompanyPicture')?.setValue(file);
                this.registerForm.get('ViewCompanyPicture')?.setValue(imageBase64);
            };

            reader.readAsDataURL(file);
            this.imageChangedEvent = event;
        }
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
        this.registerForm.get('ViewCompanyPicture')?.setValue(this.croppedImage)
    }

    registerForm:FormGroup = this._FormBuilder.group({
        Name: [''],
        Description: [''],
        CompanyEmail: [''],
        CompanyPhone: [''],
        CompanyPicture: [''],
        ViewCompanyPicture: ['assets/images/auth/defult logo.jpg'],
        Files: [''],
    })

    submitRegisterForm():void{
        let data = this.registerForm.value
        data.Files = this.files.cachedFileArray.map((item: any) => {
            const safeName = item.name.replace(/\.(jpg|png|jpeg|gif|webp|pdf|xls|xlsx).*$/i, '.$1');
            return new File([item], safeName, { type: item.type });
        });

        let formData = new FormData
        formData.append('Name', data.Name),
        formData.append('Description', data.Description),
        formData.append('CompanyPicture', data.CompanyPicture),
        formData.append('CompanyEmail', data.CompanyEmail),
        formData.append('CompanyPhone', data.CompanyPhone)
        if(data.Files){
            data.Files.forEach((items:any) => {
                formData.append('Files', items)
            });
        }

        this._CompaniesService.CreateCompany(formData).subscribe({
            next:(res)=>{
                Swal.fire({
                    icon: 'success',
                    title: res.msg,
                    padding: '2em',
                    customClass: { popup: 'sweet-alerts' },
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'https://benzeny.netlify.app';
                    }
                });
                this.registerForm.reset()
                this.registerForm.get('ViewCompanyPicture')?.setValue('assets/images/auth/defult logo.jpg')
                this.filesLogo = []
                this.imageChangedEvent = null
                this.croppedImage = ''
            }
        })
    }

    contiuneRegister():void{
        this._ActivatedRoute.paramMap.subscribe({
            next:(param)=>{
                this.companyId = param.get('id')
                if(this.companyId){
                    this.activeTab = 2
                }
            }
        })
    }

    getCompanyById():void{
        if(this.companyId){
            this._CompaniesService.GetCompanyById(this.companyId).subscribe({
                next:(res)=>{
                    this.companyData = res.data
                    this.registerForm.patchValue({
                        Name: [this.companyData.name],
                        Description: [this.companyData.description],
                        CompanyEmail: [this.companyData.companyEmail],
                        CompanyPhone: [this.companyData.companyPhone],
                        ViewCompanyPicture: [this.companyData.profilePicturePath],
                    })

                    this.registerForm.get('Name')?.disable();
                    this.registerForm.get('Description')?.disable();
                    this.registerForm.get('CompanyEmail')?.disable();
                    this.registerForm.get('CompanyPhone')?.disable();
                    this.registerForm.get('ViewCompanyPicture')?.disable();
                }
            })
        }
    }

    isImage(file: string): boolean {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
    }

    isPDF(file: string): boolean {
        return /\.pdf$/i.test(file);
    }

    isExcel(file: string): boolean {
        return /\.(xls|xlsx)$/i.test(file);
    }

    continueRegisterForm:FormGroup = this._FormBuilder.group({
        Id:[''],
        FullName:[''],
        Email:[''],
        Mobile:[''],
        Username:[''],
        Password :[''],
        SSN:[''],
    })

    submitContinueRegisterForm():void{
        if(this.companyId && this.continueRegisterForm.valid){
            let data = this.continueRegisterForm.value

            let formData = new FormData
            formData.append('Id', this.companyId),
            formData.append('FullName', data.FullName),
            formData.append('Email', data.Email),
            formData.append('Mobile', data.Mobile),
            formData.append('Username', data.Username),
            formData.append('Password', data.Password)
            formData.append('SSN', data.SSN)

            this._CompaniesService.UpdateCompany(this.companyId, formData).subscribe({
                next:(res)=>{
                    Swal.fire({
                        icon: 'success',
                        title: res.msg,
                        padding: '2em',
                        customClass: { popup: 'sweet-alerts' },
                    }).then((result) => {
                        if (result.isConfirmed) {
                             window.location.href = 'https://benzeny.netlify.app';
                        }
                    });
                }
            })
        }
    }

    store: any;
    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
        private sanitizer: DomSanitizer
    ) {
        this.initStore();
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }
}
