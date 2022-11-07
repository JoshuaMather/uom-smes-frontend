import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(
    private router: Router,
  ) { }

  public getUser() {
    return JSON.parse(localStorage.getItem('user') || '');
  }
  public setUser(value: any) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  public getStudentId() {
    return JSON.parse(localStorage.getItem('student_id') || '');
  }
  public setStudentId(value: any) {
    localStorage.setItem('student_id', JSON.stringify(value));
  }

  public getStudentData() {
    return JSON.parse(localStorage.getItem('student_data') || '');
  }
  public setStudentData(value: any) {
    localStorage.setItem('student_data', JSON.stringify(value));
  }

  public logout() {
    this.clearData();
    this.router.navigateByUrl('login');
  }

  public clearData() {
    localStorage.clear();
  }
}
