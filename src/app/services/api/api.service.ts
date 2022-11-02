import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:8000/api';

  private httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(
    private http: HttpClient,
    private data: DataService,
  ) { }

  private getData(res: Response) {
    const body = res;
    return body || {};
  }

  public setApiToken(token: string): void {
    if (token) {
      this.httpOptions.headers = new HttpHeaders({
        Authorization: 'Bearer ' + token
      });
    } else {
      this.httpOptions.headers = new HttpHeaders();
    }
  }

  public get(request: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${request}`, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.errorHandle),
        map(this.getData)
      );
  }

  public post(request: string, data = {}): Observable<any> {
    return this.http.post<any>(`${this.url}/${request}`, data, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.errorHandle),
        map(this.getData)
      );
  }

  public errorHandle = (error: HttpErrorResponse) => {
    console.error('ERROR:', error);
    if(error.status === 401) {
      this.data.logout();
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}