import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RegionandcityService {
    private readonly _HttpClient = inject(HttpClient)

    GetAllRegions(pageNumber:number = 1, pageSize:number = 10, searchTerm:string = ''):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Region/GetAllRegions?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`)
    }

    GetAllCity(regionId:string):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/City/GetCitiesByRegionId/${regionId}`)
    }
}
