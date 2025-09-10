import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllAds():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Ads/GetAllAds`)
    }

    GetAllSystemAds():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Ads/GetSystemAds`)
    }

    GetAllActiveAds():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Ads/GetAllActiveAds`)
    }

    GetAllMobileAds():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Ads/GetAllMobileAds`)
    }

    GetAdsById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Ads/GetAdsById/${id}`)
    }

    CreateAds(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Ads/CreateAds`, data)
    }

    UpdateAds(id:any, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Ads/UpdateAds/${id}`, data)
    }

    DeleteAds(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Ads/DeleteAds/${id}`)
    }

    SwitchActive(id:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Ads/SwitchActive/${id}`, {})
    }

}
