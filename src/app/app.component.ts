import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'University of Manchester - Student Management & Engagement Systsem';
  constructor(
    private router: Router,
  ) {
  }

  initializeApp() {
    this.router.navigateByUrl('login');
  }
  
}
