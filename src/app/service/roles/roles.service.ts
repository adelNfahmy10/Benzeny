import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllRoles():Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Roles/GetAllRoles`)
    }

    CreateRoles(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Roles/AddNewRole`, data)
    }

    DeleteRole(name:number):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Roles/DeleteRole/roleName?roleName=${name}`)
    }
}
