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
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'currentGrade', 'maxCurrentGrade', 'predictedGrade', 'engagement', 'concerns'];

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
          case 'attendance': return  item.engagement.attendance;
          case 'currentGrade': return  item.engagement.current;
          case 'maxCurrentGrade': return  item.engagement.max_current;
          case 'predictedGrade': return  item.engagement.predict;
          case 'engagement': return  item.engagement.engagement;
          case 'concerns': return  item.concerns_count;
          default: return item[property];
          }
        }
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        let searchFilter = (data.user.name.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.user.email.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.personal_tutor.user.name.toLowerCase().indexOf(this.searchValue) != -1);

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
  
  gradeTooltip(grade:any, max:any, reduced:any, unreducedGrade:any, mit_circs:any){
    let text = '';
    if(grade/max < 0.4){
      text += "Grade is a fail\n"
    }
    if(reduced && grade!=unreducedGrade){
      let g = (unreducedGrade*100).toFixed(0);
      if(g!=grade){
        text += "Grade reduced due to late submissions: " + g + "% before reduction\n";
      }
    }
    if(mit_circs) {
      text += 'Mitigating circumstances applied - see student grades for more info\n';
    }
    return text;
  }
}
