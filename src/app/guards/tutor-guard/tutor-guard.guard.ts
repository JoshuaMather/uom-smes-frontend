import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class TutorGuardGuard implements CanActivate {
  
  constructor(
    private data: DataService,
    private router: Router,
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.data.getUser().tutor){
        return true;
      } else {
        window.alert("You don't have permissions for this page");
        return false;
      }
  }
  
}
