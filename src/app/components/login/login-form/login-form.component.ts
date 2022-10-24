import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    if (this.form.valid) {
      this.loginEv.emit(this.form.value);
    } else {
      this.error = "Incorrect Login Details";
    }
  }

  
}
