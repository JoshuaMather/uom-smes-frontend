import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';

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
  public selectedTutor: string = '';
  
  @Input() tutor: any; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'currentGrade', 'predictedGrade', 'engagement', 'concerns'];

  years: any = [
    {value: '', viewValue: 'All'},
    {value: '1', viewValue: '1'},
    {value: '2', viewValue: '2'},
    {value: '3', viewValue: '3'},
  ];

  tutors: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private data: DataService,
  ) { }

  ngOnInit(): void {
    console.log(this.tutor);
    this.loadStudents();
  }

  loadStudents() {
    this.api.get(`tutors`).subscribe(res => {
      console.log(res);
      this.tutors = res.tutors;
      this.tutors.unshift({
        user: {
          name: 'All'
        },
        id: ''
      });
    });

    this.api.get(`students/${this.tutor.tutor.id}`).subscribe(res => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return  item.user.name;
          case 'email': return  item.user.email;
          case 'personalTutor': return  item.personal_tutor.user.name;
          case 'currentGrade': return  item.grades.current;
          case 'predictedGrade': return  item.grades.predict;
          case 'engagement': return  item.grades.engagement;
          case 'concerns': return  item.concerns_count;
          default: return item[property];
          }
        }
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        let searchFilter = (data.user.name.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.user.email.toLowerCase().indexOf(filter) != -1 ||
                            data.personal_tutor.user.name.toLowerCase().indexOf(filter) != -1);

        let yearFilter = data.year == this.selectedYear;

        let tutorFilter = data.personal_tutor.id == this.selectedTutor;
        if(this.selectedYear!=='' && this.selectedTutor!==''){
          return searchFilter && yearFilter && tutorFilter;
        } else if(this.selectedYear!=='') {
          return searchFilter && yearFilter;
        } else if(this.selectedTutor!=='') {
          return searchFilter && tutorFilter;
        }
        return searchFilter;
      }
      this.loading = false;
    });
  }

  filter() {
    this.dataSource.filter = 'filter'; // trigger filter
  }

  studentClicked(row: any) {
    console.log(row);
    this.data.setStudentId(row.id);
    this.router.navigate(['/student']);
  }
  

}
