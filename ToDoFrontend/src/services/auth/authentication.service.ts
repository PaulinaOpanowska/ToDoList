import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import {HttpClientModule, HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { ConfigService } from '../../common-services/config.service';
import { Token } from '../../models/Token';

@Injectable()
export class AuthenticationService {
    [x: string]: any;
    public token: Token;
    private backendUrl: string;
    private logoutBackendUrl: string;
    private pobierzNazweUzytkownikaBackendUrl: string;
    private logged: boolean = false;
    private username: string;

    constructor(private http:HttpClient, private configService: ConfigService) 
    {
        this.backendUrl = configService.getBackendUrl('login');
        this.logoutBackendUrl = configService.getBackendUrl('logout');
        this.pobierzNazweUzytkownikaBackendUrl = configService.getBackendUrl('pobierznazweusera');
    }

    login(username: string, password: string): Promise<any> 
    {
        this.username = username;
        const url = this.backendUrl;
        let a=JSON.stringify({Login:username,Haslo:password});

        return this.http
            .post(url,a,{headers: new HttpHeaders()   
                            .set('Content-type', 'application/json'),  
                        })
            .toPromise()
            .then(response => {
                return this.handleLoginSucess(response)
            })
            .catch(error => {
                return this.handleError(error)
            })
    }

    private handleLoginSucess(response: any): Promise<any> {
        this.logged = true;
        localStorage.setItem('zalogowany', JSON.stringify({ login: this.username, token: response.token }));
        this.configService.setToken(response.token);
        return Promise.resolve(response);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    logoutold() {
        const url = this.logoutBackendUrl;
        return this.http
            .post(url, [], {headers: this.headers})
            .toPromise()
            .then(response => {
                this.logged = false;
                return Promise.resolve(response);
            })
            .catch(error => {
                return this.handleError(error)
            })
    }

    logout(): void {
        this.logged = false;
        this.token = null;
        localStorage.removeItem('zalogowany');
    }

    pobierzToken(): string {
        this.token=JSON.parse(localStorage.getItem('zalogowany'));
        if(this.token!=null)
            return this.token.token;
        return "";
    }

    pobierzLogin(): string {
        this.token=JSON.parse(localStorage.getItem('zalogowany'));
        if(this.token!=null)
            return this.token.login;
        return "";
    }

    loggedIn():boolean {
        if(this.pobierzToken() == "")
        {
            this.logged = false;
        }
        else {
            this.logged = true;
        }
        
        return this.logged;
    }

    pobierzNazweUzytkownik(): Observable<string> {
        const url = this.pobierzNazweUzytkownikaBackendUrl;
        
        return this.http
        .get(url,{
            headers: this.configService.getAuthorizationHeader()
            ,responseType: 'text' 
         })

    }
}