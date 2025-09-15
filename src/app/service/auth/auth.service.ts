import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private readonly _HttpClient = inject(HttpClient)

    login(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Auth/login`, data)
    }

    refreshToken(data:any):Observable<any>{
        return this._HttpClient.post(`${environment.baseUrl}api/Auth/refresh`, data)
    }


}
