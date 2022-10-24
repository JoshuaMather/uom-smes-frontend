import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderDataService {
  private page: string = '';

  constructor() { }

  public getpage(): string {
    return this.page;
  }
  public setpage(value: string) {
    this.page = value;
  }
}
