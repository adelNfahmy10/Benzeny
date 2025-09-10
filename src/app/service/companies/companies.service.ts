import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllCompanies(pageNumber:number = 1, pageSize:number = 100, searchTerm:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Company/GetAllCompanies?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`)
    }

    GetCompanyById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Company/GetCompanyById/${id}`)
    }

    GetAllUserInCompany(id:string, searchTerm:string, pageNumber:number = 1, pageSize:number = 100):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Company/GetAllUserInCompany/${id}?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    }

    GetUserByIdInCompany(companyId:string, userId:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Company/GetUserByIdInCompany${companyId}/${userId}`)
    }

    CreateCompany(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Company/CreateCompany`, data)
    }

    UpdateCompany(id:string, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Company/UpdateCompany/${id}`, data)
    }

    DeleteCompany(id:string):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Company/DeleteCompany/${id}`)
    }

    // ##################################################################
    CompanySwitchActive(companyId:string):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Company/CompanySwitchActive/${companyId}`, {})
    }
}
