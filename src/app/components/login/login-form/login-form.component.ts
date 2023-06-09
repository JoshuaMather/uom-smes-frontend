import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';
import { RegisterTutorComponent } from '../../register-tutor/register-tutor.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  public loggingIn = false;

  @Output() loginEv = new EventEmitter();

  public error = '';

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private api: ApiService,
    private data: DataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    
  }

  login() {
    this.loggingIn = true;
    this.error='';
    if (this.form.valid) {
      this.api.post('login', this.form.value).subscribe(res => {
        this.data.setUser(res.user);
        this.data.setCourses(res.all_courses);
        if(res.user.student) {
          this.data.setStudentId(res.user.student.id);
        }
        this.api.setApiToken(res.token);
        console.log('RES', res);
        this.loginEv.emit(this.form.value);
        this.loggingIn = false;
      }, error => {
        console.log(error);
        this.error = "Incorrect Login Details";
        this.loggingIn = false;
      });
    } else {
      this.error = "Incorrect Login Details";
      this.loggingIn = false;
    }
  }

  registerTutor() {
    const dialogRef = this.dialog.open(RegisterTutorComponent, {
      panelClass: 'concern-list-class',
    });
  }

  
}