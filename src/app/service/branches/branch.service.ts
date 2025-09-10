import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllBranches(pageNumber:number = 1, pageSize:number = 100, searchTerm:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Branch/GetAllBranches?pageNumber=${pageNumber}pageSize=${pageSize}&searchTerm=${searchTerm}`)
    }

    GetAllBranchesByCompanyId(companyId:any, pageNumber:number = 1, pageSize:number = 100, searchTerm:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Branch/GetAllBranchesInCompany/${companyId}?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`)
    }

    GetBranchById(id:any):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Branch/GetById/${id}`)
    }

    CreateBranch(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Branch/CreateBranch`, data)
    }

    UpdateCompany(id:any, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Branch/UpdateBranch/${id}`, data)
    }

    DeleteBranch(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Branch/DeleteBranch/${id}`)
    }
    /* ##################################################### */
    SwitchActiveBranch(id:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Branch/SwitchActive/${id}`, {})
    }

    AssignUserToBranch():Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Branch/AssignUserToBranch`, {})
    }

    UnassignUserFromBranch():Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Branch/UnassignUserFromBranch`)
    }
}
