import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  public get(request: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${request}?api_token=${this.data.getToken()}`, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.errorHandle),
        map(this.getData)
      );
  }

  public post(request: string, data = {}): Observable<any> {
    return this.http.post<any>(`${this.url}/${request}?api_token=${this.data.getToken()}`, data, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.errorHandle),
        map(this.getData)
      );
  }

  public errorHandle = (error: HttpErrorResponse) => {
    console.error('ERROR:', error);
    // return an observable with a user-facing error message
    return throwError(error);
  }
}