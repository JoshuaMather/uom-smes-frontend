import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  // @Input() error: string | null | undefined;

  @Output() loginEv = new EventEmitter();

  public error = '';

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private api: ApiService,
    private data: DataService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.error='';
    if (this.form.valid) {
      this.api.post('login', this.form.value).subscribe(res => {
        this.data.setUser(res.user);
        this.data.setToken(res.token);
        console.log('RES', res);
        this.loginEv.emit(this.form.value);
      }, error => {
        console.log(error);
        this.error = "Incorrect Login Details";
      });
    } else {
      this.error = "Incorrect Login Details";
    }
  }

  
}