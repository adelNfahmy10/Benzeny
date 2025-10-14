import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    private readonly _HttpClient = inject(HttpClient)

    getAllLogs(pageNumber:any, pageSize:any, search:any ,dateFrom:any, dateTo:any ):Observable<any>{
        return this._HttpClient.get(`${environment.baseUrl}api/Log?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${search}&fromDate=${dateFrom}&toDate=${dateTo}`)
    }

}
