import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api/api.service';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'University of Manchester - Student Management & Engagement Systsem';
  constructor(
    private router: Router,
    private api: ApiService,
    private data: DataService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if(!localStorage.getItem('api_token') || !localStorage.getItem('user')){
      this.data.logout();
    }
    this.api.setApiToken(localStorage.getItem('api_token') || '');
  }
  
}
