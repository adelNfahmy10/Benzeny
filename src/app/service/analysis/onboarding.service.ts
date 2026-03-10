import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
    private readonly _HttpClient = inject(HttpClient)

    getOnboardingStats():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Analysis/Onboarding/Stats`)
    }

    getOnboardingTable():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Analysis/Onboarding/Table`)
    }

    getOnboardingCompanyDetails(id:any):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Analysis/Onboarding/CompanyDetails/${id}`)
    }

    UpdateOnboardingCompanyStatus(body:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Analysis/Onboarding/UpdateCompanyStatus`,body)
    }
}
