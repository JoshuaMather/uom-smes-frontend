import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  public studentList: any = [];
  public loading: Boolean = true;
  
  @Input() tutor: any; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'averageGrade', 'concerns'];

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
      this.dataSource = new MatTableDataSource(res.students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return  item.user.name;
          case 'email': return  item.user.email;
          case 'personalTutor': return  item.personal_tutor.user.name;
          case 'averageGrade': return  item.average_grade;
          case 'concerns': return  item.concerns_count;
          default: return item[property];
          }
        }
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }

  studentClicked(row: any) {
    console.log(row);
  }

}
