import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public login($event: any) {
    console.log($event)
    if($event.username.includes('tutor')) {
      this.router.navigateByUrl('tutor/0');
    } else if($event.username.includes('student')) {
      this.router.navigateByUrl('student/0');
    } else {
      
    }
  }

}
