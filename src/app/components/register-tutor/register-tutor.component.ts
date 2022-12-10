import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-register-tutor',
  templateUrl: './register-tutor.component.html',
  styleUrls: ['./register-tutor.component.scss']
})
export class RegisterTutorComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    role: new FormControl(''),
    year: new FormControl(''),
  });

  roles = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'year_tutor', viewValue: 'Year Tutor'},
    {value: '', viewValue: 'None'},
  ];

  years = [
    {value: '', viewValue: ''},
    {value: '1', viewValue: '1'},
    {value: '2', viewValue: '2'},
    {value: '3', viewValue: '3'},
  ];

  public error = '';

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
  }

  register() {
    this.error='';
    if (this.form.valid) {
      this.api.post('request-register-tutor', this.form.value).subscribe(res => {
        console.log(res);
      })
    }
  }

}
