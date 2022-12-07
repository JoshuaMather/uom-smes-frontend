import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent implements OnInit {
  private studentId: number = 0;
  private userId: number = 0;
  public student: any;
  public loading: Boolean = true;

  constructor(
    private data: DataService,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.data.getStudentId();
    this.userId = this.data.getUser().id;
    this.loadStudent();
  }

  loadStudent() {
    this.api.get(`student/${this.studentId}/${this.userId}`).subscribe(res => {
      console.log('student data', res.student);
      this.student = res;
      this.data.setStudentData(res.student);
      this.loading = false;
    });
  }

}
