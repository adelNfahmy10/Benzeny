import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllDrivers(searchTerm:string, pageNumber:number = 1, pageSize:number = 100):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Drivers/GetAllDrivers?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    }

    GetDriverById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Drivers/GetDriverById/${id}`)
    }

    GetDriversInCompany(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Drivers/GetDriversInCompany/${id}`)
    }

    GetDriversInBranch(id:string, searchTerm:string, pageNumber:number = 1, pageSize:number = 100):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Drivers/GetDriversInBranch/${id}?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    }

    CreateDriver(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/CreateDriver`, data)
    }

    DeleteDriver(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Drivers/DeleteDriver/${id}`)
    }

    /* ################################################################## */
    DriverSwitchActive(id:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/DriverSwitchActive/${id}`, {})
    }
    DriverAssignFunds(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/assign-funds`, data)
    }
    AssignDriverToCar(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/AssignDriverToCar`, data)
    }
    UnassignDriverFromCar(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/UnassignDriverFromCar`, data)
    }
    importDriverFile(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Drivers/import`, data)
    }
}
