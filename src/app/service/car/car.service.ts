import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllCars(searchTerm:string, pageNumber:number = 1, pageSize:number = 100):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Car/GetAllCars?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    }

    GetCarById(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Car/GetCarById/${id}`)
    }

    GetAllCarsInCompany(id:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Car/GetAllCarsInCompany/${id}`)
    }

    GetAllCarsInBranch(id:string, searchTerm:string, pageNumber:number = 1, pageSize:number = 10):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Car/GetAllCarsInBranch/${id}?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    }

    CreateCar(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Car/CreateCar`, data)
    }

    UpdateCar(id:any, data:any):Observable<any>{
        return this._HttpClient.put(`${environment.baseUrl}api/Car/UpdateCar/${id}`, data)
    }

    DeleteCar(id:any):Observable<any>{
        return this._HttpClient.delete(`${environment.baseUrl}api/Car/DeleteCar/${id}`)
    }
    /* ##################################################### */
    ImportCarFromExcel(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Car/ImportCarFromExcel`, data)
    }

    CarSwitchActive(id:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Car/CarSwitchActive/${id}`, {})
    }
}
