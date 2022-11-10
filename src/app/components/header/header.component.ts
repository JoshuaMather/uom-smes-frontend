import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  subscriptionRoute!: Subscription;
  public showMenu = false;
  public showBack = false;

  constructor(
    private router: Router,
    private data: DataService,
  ) { }

  ngOnInit(): void {

    this.subscriptionRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if(event.url === '/' || event.url === '/login'){
          this.showMenu = false;
        } else {
          this.showMenu = true;
        }
        if(event.url === '/student' && this.data.getUser().tutor) {
          this.showBack = true;
        } else {
          this.showBack = false;
        }
      }
    });
  }

  back() {
    this.router.navigateByUrl('/tutor');
  }

  logout() {
    if(confirm("Are you sure you want to logout?")) {
      this.data.logout();
    }
  }


}
