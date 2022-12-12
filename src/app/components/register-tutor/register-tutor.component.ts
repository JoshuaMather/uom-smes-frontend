import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<RegisterTutorComponent>,
    private api: ApiService
  ) { }

  ngOnInit(): void {
  }

  register() {
    this.error='';
    console.log(this.form.controls['role'].value);
    if(this.form.controls['year'].value === '' && this.form.controls['role'].value === 'year_tutor') {
      this.error = 'Year Tutor must have a year selected';
      return;
    }
    if(this.form.controls['year'].value != '' && this.form.controls['role'].value != 'year_tutor') {
      this.error = 'Only Year Tutor can have a year selected';
      return;
    }

    if (this.form.valid) {
      this.api.post('request-register-tutor', this.form.value).subscribe(res => {
        console.log(res);
        if(res.success==400){
          this.error = res.error;
          return;
        }
        this.close()
      })
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
