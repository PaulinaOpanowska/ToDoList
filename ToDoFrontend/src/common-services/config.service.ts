import {Injectable} from '@angular/core';
import { environment } from '../environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService 
{
    private token;

    constructor(private http: HttpClient) {

    }

    public getBackendUrl(backendname: string): string 
    {
        let baseUrl = environment.baseBackednUrl;
        let targetBeckend = environment.backends[backendname] || `[${backendname}]`;
        targetBeckend = baseUrl + targetBeckend;
        return targetBeckend;
    }

    public setToken(token) 
    {
        this.token = token;
    }

    public getToken():string
    {
        this.token=JSON.parse(localStorage.getItem('zalogowany'));
        if(this.token!=null)
            return this.token.token;
        return "";
    }

    public getAuthorizationHeader(): HttpHeaders
    {
       let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken())  
       .set('content-Type', 'application/json')
       return headers;    
    }

    public getAuthorizationHeaderFormData(): HttpHeaders
    {
       let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken())  
       .set('enctype', 'multipart/form-data')
       return headers;    
    }
}
