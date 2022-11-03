import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  @Input() tutor: any; 
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'averageGrade', 'concerns'];

  public studentList: any;
  public loading: Boolean = true;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    console.log(this.tutor);
    this.loadStudents();
  }

  loadStudents() {
    this.api.get(`students/${this.tutor.id}`).subscribe(res => {
      console.log(res);
      this.studentList = res.students;
      this.loading = false;
    });
  }

  studentClicked(row: any) {
    console.log(row);
  }

}
