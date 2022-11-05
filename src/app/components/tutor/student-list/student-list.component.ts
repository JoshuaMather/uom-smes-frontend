import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  public studentList: any = [];
  public loading: Boolean = true;

  public searchValue: string = '';
  public selectedYear: string = '';
  
  @Input() tutor: any; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'averageGrade', 'concerns'];

  years: any = [
    {value: '', viewValue: ''},
    {value: '1', viewValue: '1'},
    {value: '2', viewValue: '2'},
    {value: '3', viewValue: '3'},
  ];

  constructor(
    private api: ApiService,
    private router: Router,
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
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.user.name.toLowerCase().indexOf(filter) != -1 || 
              data.user.email.toLowerCase().indexOf(filter) != -1 ||
              data.personal_tutor.user.name.toLowerCase().indexOf(filter) != -1;
      }
      this.loading = false;
    });
  }

  search(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  studentClicked(row: any) {
    console.log(row);
    this.router.navigate(['/student', { studentId: row.id }]);
  }
  

}
