import { SaveToDo } from './../models/ToDo';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../common-services/config.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ToDoService {
  private deleteToDoUrl: string;
  private editToDoUrl: string;
  private getToDoByIdUrl: string;
  private createToDoUrl: any;
  private getToDosUrl: string;
  private getPrioritiesUrl: any;

  constructor(private http:HttpClient, private configService: ConfigService) 
  {
      this.getToDosUrl = configService.getBackendUrl('getall');
      this.getPrioritiesUrl = configService.getBackendUrl('getprior');
      this.createToDoUrl = configService.getBackendUrl('create');  
      this.getToDoByIdUrl = configService.getBackendUrl('get'); 
      this.editToDoUrl = configService.getBackendUrl('put'); 
      this.deleteToDoUrl = configService.getBackendUrl('delete'); 
  }

  public getToDos(filter): Observable<any[]> 
  {
    return this.http.get<any[]>(this.getToDosUrl + '?' + this.toQueryString(filter)
      ,{headers:this.configService.getAuthorizationHeader()});
  }

  public getPriorities(): Observable<any[]> 
  {
    return this.http.get<any[]>(this.getPrioritiesUrl
      ,{headers:this.configService.getAuthorizationHeader()});
  }

  toQueryString(obj) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined) 
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }

  create(todo) {
    return this.http.
    post(this.createToDoUrl,todo,{headers:this.configService.getAuthorizationHeader()})
    .map(res => <any>res);
  }

  getToDo(id) {
    return this.http.get<any>(this.getToDoByIdUrl + '/' + id
        ,{headers:this.configService.getAuthorizationHeader()});
  }

  update(todo: SaveToDo) {
    return this.http.
    put(this.editToDoUrl + '/' + todo.id,todo,{headers:this.configService.getAuthorizationHeader()})
    .map(res => <any>res);
  }

  delete(id) {
    return this.http.delete(this.deleteToDoUrl + '/' + id
    ,{headers:this.configService.getAuthorizationHeader()});
  }
}