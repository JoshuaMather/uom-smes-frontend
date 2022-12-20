import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tutor-courses',
  templateUrl: './tutor-courses.component.html',
  styleUrls: ['./tutor-courses.component.scss']
})
export class TutorCoursesComponent implements OnInit {
  @Input() tutor: any;
  
  selectedCourse: any;
  loading = false;

  course: any = [];
  students: any;


  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.selectedCourse = this.tutor.tutor.course[0].id;
    this.loadCourseInfo();
  }

  loadCourseInfo() {
    console.log(this.selectedCourse);
    this.api.get(`tutor-course/${this.tutor.tutor.id}/${this.selectedCourse}`).subscribe(res => {
      console.log(res);
      this.course = res.course;
      this.students = res.students;
      
      this.loading = false;
    });
  }

  courseChanged() {
    this.loading = true;
    this.loadCourseInfo();
  }

}
