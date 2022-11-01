import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
    private data: DataService,
  ) { }

  ngOnInit(): void {
  }

  public login($event: any) {
    console.log(this.data.getUser());
    if(this.data.getUser().tutor) {
      this.router.navigateByUrl('tutor/0');
    } else if(this.data.getUser().student) {
      this.router.navigateByUrl('student/0');
    }
  }

}
