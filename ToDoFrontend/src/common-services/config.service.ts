import {Injectable} from '@angular/core';
import { environment } from '../environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService 
{
    private czyWlascicielBokBackUrl: string;
    private token;
    private zapiszJezykBackendUrl: string;
    private pobierzJezykDlaZalogowanego: string;
    private pobierzDostepneJezyki: string;
    private sprawdzczyposiadarole: string;
    private pobierzKonfiguracjeTabelBackUrl: string;
    private zapiszKonfiguracjeTabelBackUrl: string;

    constructor(private http: HttpClient) {
        this.zapiszJezykBackendUrl = this.getBackendUrl('zapiszjezyk');
        this.pobierzJezykDlaZalogowanego = this.getBackendUrl('pobierzjezykdlazalogowanego');
        this.pobierzDostepneJezyki = this.getBackendUrl('pobierzjezyki');
        this.sprawdzczyposiadarole = this.getBackendUrl('sprawdzczyposiadarole');
        this.pobierzKonfiguracjeTabelBackUrl = this.getBackendUrl('pobierzkonfiguracjetabel');
        this.zapiszKonfiguracjeTabelBackUrl = this.getBackendUrl('zapiszkonfiguracjetabel')
        this.czyWlascicielBokBackUrl = this.getBackendUrl('sprawdzczyuzytkownikwlascicielbok');
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

    public pobierzIkony(): Observable<any> {
        return this.http.get("./assets/icons/icons.json")
        .map(res => <any[]>res);
    }

    public zapiszJezyk(idlng: number, id: any): any {

        return this.http
        .put(this.zapiszJezykBackendUrl + "?idjezyka=" + idlng + "&iduzytkownika=" + id , null,
        {
            headers: this.getAuthorizationHeader()
            ,responseType: 'text' 
        })
        .map(res => <string>res);
    }

    pobierzJezyk(): Observable<string> {
        const url = this.pobierzJezykDlaZalogowanego;
        
        return this.http
        .get(url,{
            headers: this.getAuthorizationHeader()
            ,responseType: 'text' 
         })
    }

    pobierzJezyki(): Observable<any[]>  {
        const url = this.pobierzDostepneJezyki;

        return this.http
          .get(url,{
            headers: this.getAuthorizationHeader()
         })
          .map(res => <any[]>res);
    }

    sprawdzCzyPosiadaRole(nazwaroli: string) : Observable<boolean> {
        const url = this.sprawdzczyposiadarole;
        
        return this.http
        .get(url + "?nazwa=" + nazwaroli,{
            headers: this.getAuthorizationHeader()
         })
         .map(result => <boolean>result)
    }

    pobierzKonfiguracjeTabel(typ: number): Observable<any>  {
        const url = this.pobierzKonfiguracjeTabelBackUrl;

        return this.http
          .get(url + '?typ=' + typ,{
            headers: this.getAuthorizationHeader()
         })
          .map(res => <any>res);
    }

    zapiszKonfiguracjeTabel(typ: number, niewidoczne: string, id?: number): Observable<any>  {
        const url = this.zapiszKonfiguracjeTabelBackUrl;

        return this.http
            .put(url,JSON.stringify({Id: id == null ? 0 : id, UzytkownikId:0, ObiektTyp:typ, NiewidoczneKolumny:niewidoczne}), 
            {
                headers: this.getAuthorizationHeader()
                ,responseType: 'text' 
            })
            .map(res => <any>res);
    }

    sprawdzCzyWlascicielBok() : Observable<boolean> {
        const url = this.czyWlascicielBokBackUrl;
        
        return this.http
        .get(url,{
            headers: this.getAuthorizationHeader()
         })
         .map(result => <boolean>result)
    }
}
