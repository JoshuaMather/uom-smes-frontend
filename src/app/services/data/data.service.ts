import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private user: any;
  
  constructor(
    private router: Router,
  ) { }

  public getUser() {
    return this.user;
  }
  public setUser(value: any) {
    console.log(value);
    this.user = value;
  }

  public logout() {
    this.clearData();
    this.router.navigateByUrl('login');
  }

  public clearData() {
    this.user = null;
  }
}
