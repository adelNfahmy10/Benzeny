import { Component, inject } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesService } from '../service/companies/companies.service';
import { AuthService } from '../service/auth/auth.service';

@Component({
    templateUrl: './boxed-signin.html',
    animations: [toggleAnimation],
})
export class BoxedSigninComponent {
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _AuthService = inject(AuthService)

    loginForm:FormGroup = this._FormBuilder.group({
        username: ['admin@benzeny.com'],
        password: ['Admin@123'],
    })

    submiLoginForm():void{
        let data = this.loginForm.value
        this._AuthService.login(data).subscribe({
            next:(res)=>{
                console.log(res);

                if(res.data.companyId){
                    localStorage.setItem('companyId', res.data.companyId)
                    localStorage.setItem('companyName', res.data.companyName)
                }
                localStorage.setItem('userId', res.data.userId),
                localStorage.setItem('fullName', res.data.fullName),
                localStorage.setItem('token', res.data.accessToken),
                localStorage.setItem('refreshToken', res.data.refreshToken),
                localStorage.setItem('role', res.data.roles)
                localStorage.setItem('branchId', res.data?.branches[0]?.branchId)
                localStorage.setItem('allBranches', JSON.stringify(res.data?.branches));
                if(localStorage.getItem('role') == 'Benzeny'){
                    this.router.navigate(['/benzeny-dashboard'])
                } else if(localStorage.getItem('role') == 'CompanyOwner' || localStorage.getItem('role') == 'Admin'){
                    this.router.navigate(['/company-dashboard'])
                } else if(localStorage.getItem('role') == 'BranchManager'){
                    this.router.navigate(['/branch-dashboard'])
                }
            }
        })
    }


    store: any;
    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
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
