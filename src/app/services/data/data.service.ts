import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private user: any;
  private token: any;
  
  constructor() { }

  public getUser() {
    return this.user;
  }
  public setUser(value: any) {
    console.log(value);
    this.user = value;
  }

  public getToken() {
    return this.token;
  }
  public setToken(value: any) {
    console.log(value);
    this.token = value;
  }
}
