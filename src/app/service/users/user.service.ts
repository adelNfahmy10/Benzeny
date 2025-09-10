import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly _HttpClient = inject(HttpClient)


    GetAllUsersByCompanyId(companyId:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/GetAllUsersInCompany/${companyId}/users`)
    }

    GetAllUsers():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/GetAll`)
    }

    GetUserById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/GetById/${id}`)
    }

    GetAdminBenzenyCount():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/UserManager/GetAdminBenzenyCount`)
    }

    CreateUser(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/UserManager/RegisterNewUser`, data)
    }

    UpdateUser(id:any, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/UserManager/Update?id=${id}`, data)
    }

    DeleteUser(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/UserManager/DeleteUser/${id}`)
    }

    SwitchUserActive(id:string):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/UserManager/SwitchUserActive/${id}`, {})
    }
}
