import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  public searchValue: string = '';

  course: any = [];
  students: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'currentGrade', 'predictedGrade'];

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

      this.dataSource = new MatTableDataSource(this.students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return  item.user.name;
          case 'email': return  item.user.email;
          case 'personalTutor': return  item.personal_tutor.user.name;
          case 'currentGrade': return  item.grades.current;
          case 'predictedGrade': return  item.grades.predict;
          default: return item[property];
          }
        }
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        let searchFilter = (data.user.name.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.user.email.toLowerCase().indexOf(filter) != -1 ||
                            data.personal_tutor.user.name.toLowerCase().indexOf(filter) != -1);
        return searchFilter;
      }

      this.loading = false;
    });
  }

  filter() {
    this.dataSource.filter = 'filter'; // trigger filter
  }

  courseChanged() {
    this.loading = true;
    this.loadCourseInfo();
  }

}
