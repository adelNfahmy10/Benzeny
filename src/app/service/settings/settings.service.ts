import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
    private readonly _HttpClient = inject(HttpClient)

    // ########## Car Brand ########## //
    GetAllCarBrands():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Settings/GetAllCarBrands`)
    }

    CreateCarBrands(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Settings/CreateCarBrands`, data)
    }

    UpdateCarBrands(data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Settings/UpdateCarBrands`, data)
    }

    DeleteCarBrands(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Settings/DeleteCarBrands/${id}`)
    }

    // ########## Car Model ########## //
    GetAllCarModels():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Settings/GetAllCarModels`)
    }

    CreateCarModels(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Settings/CreateCarModels`, data)
    }

    UpdateCarModels(data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Settings/UpdateCarModels`, data)
    }

    DeleteCarModel(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Settings/DeleteCarModel/${id}`)
    }

    // ########## Plate Type ########## //
    GetAllPlateTypes():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Settings/GetAllPlateTypes`)
    }

    CreatePlateTypes(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Settings/CreatePlateTypes`, data)
    }

    UpdatePlateTypes(data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Settings/UpdatePlateTypes`, data)
    }

    DeletePlateTypes(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Settings/DeletePlateTypes/${id}`)
    }

    // ########## Car Type ########## //
    GetAllCarTypes():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Settings/GetAllCarTypes`)
    }

    CreateCarTypes(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Settings/CreateCarTypes`, data)
    }

    UpdateCarTypes(data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Settings/UpdateCarTypes`, data)
    }

    DeleteCarTypes(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Settings/DeleteCarTypes/${id}`)
    }

    // ########## Tags ########## //
    GetAllTags():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Settings/GetAllTags`)
    }

    CreateTags(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Settings/CreateTags`, data)
    }

    UpdateTags(data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Settings/UpdateTags`, data)
    }

    DeleteTags(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Settings/DeleteTags/${id}`)
    }
}
