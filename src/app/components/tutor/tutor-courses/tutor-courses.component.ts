import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api/api.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-tutor-courses',
  templateUrl: './tutor-courses.component.html',
  styleUrls: ['./tutor-courses.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TutorCoursesComponent implements OnInit {
  @Input() tutor: any;
  @ViewChild('barGraph', {static: true}) barGraph!: any;

  chart: any;
  
  selectedCourse: any;
  loading = false;
  public searchValue: string = '';

  course: any = [];
  students: any = [];
  distribution: any = [];
  expandedStudent: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'currentGrade', 'maxCurrentGrade', 'predictedGrade', 'engagement', 'expand'];

  courseList: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private data: DataService,
  ) { }

  ngOnInit(): void {
    if(this.tutor.tutor.role==='admin'){
      this.courseList = this.data.getCourses();
    } else {
      this.courseList = this.tutor.tutor.course;
    }
    this.courseList.unshift({
      id: 0,
      course_code: '',
      course_name: 'Select Course' 
    })

    this.selectedCourse = this.courseList[0].id;
  }

  loadCourseInfo() {
    console.log(this.selectedCourse);
    this.api.post(`tutor-course/${this.tutor.tutor.id}/${this.selectedCourse}`).subscribe(res => {
      console.log(res);
      this.course = res.course;
      this.students = res.students;
      this.distribution = res.distribution;
      this.createBar();


      this.students.forEach((student: { courseActivity: { activity: { activity: any; attendance: string; weekAttended: any; }; }[]; courseAssignments: any[]; }) => {
        let activityData: { activity: { activity: any; attendance: string; weekAttended: any; }; }[] = [];
        const groupBy = (array: any[]) => {
          return array.reduce((result, currentValue) => {
            // console.log(result, currentValue);
            (result[currentValue.activity_name] = result[currentValue.activity_name] || []).push(
              currentValue
            );
            return result;
          }, {});
        };

        let courseAttendance = student.courseActivity;

        const groupedAttnedance = groupBy(courseAttendance);
        
        Object.entries(groupedAttnedance).forEach((value: any) => {
          let activityWeeks = value[1];

          var attended = activityWeeks.map(function(activity: { attended: any; }){
            return activity.attended;
          });

          let weekAttendence = (attended.reduce((a: any, b: any) => a + b) / parseFloat(attended.length)).toFixed(2);

          let courseActivityObject = {
            activity: value[0],
            attendance: weekAttendence,
            weekAttended: attended
          }

          activityData.push({activity: courseActivityObject});
        });

        student.courseActivity = activityData;

        let assignmentData: any = [];
        let formative: any[] = [];
        let summative: any[] = [];
        let summativeWeight = 0;
        student.courseAssignments.forEach(assignment => {
          if(assignment.type.includes('_f')){
            formative.push(assignment);
          }else if(assignment.type.includes('_s')){
            summative.push(assignment);
            summativeWeight += assignment.engagement_weight;
          }
        });

        assignmentData.push({
          summative: summative,
          formative: formative,
          summativeWeight: summativeWeight,
        });

        student.courseAssignments = assignmentData[0];
      });


      this.dataSource = new MatTableDataSource(this.students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return  item.user.name;
          case 'email': return  item.user.email;
          case 'personalTutor': return item.personal_tutor.user.name;
          case 'attendance': return item.studentCourse[0].attendance.attendance;
          case 'currentGrade': return  item.studentCourse[0].grades.current;
          case 'maxCurrentGrade': return  item.studentCourse[0].grades.max_current;
          case 'predictedGrade': return  item.studentCourse[0].grades.predict;
          case 'engagement': return item.studentCourse[0].engagement;
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
    console.log(this.students)
  }

  filter() {
    this.dataSource.filter = 'filter'; // trigger filter
  }

  courseChanged() {
    if(this.selectedCourse===0){
      return;
    }
    this.loading = true;
    if(this.chart){
      this.chart.destroy();
    }
    this.loadCourseInfo();
  }

  createBar() {
    let labels: string[] = [];
    let currentGrades: any[] = [];
    let predictedGrades: any[] = [];
    let gradeDatasets = [];

    this.distribution.forEach((dist: { label: string; current: any; predicted: any; }) => {
      labels.push(dist.label);
      currentGrades.push(dist.current);
      predictedGrades.push(dist.predicted);
    });

    console.log(labels, currentGrades, predictedGrades)

    gradeDatasets.push(
      {
        label: 'Current Grades',
        data: currentGrades
      }, 
      {
        label: 'Predicted Grades',
        data: predictedGrades
      }
    );

    this.chart = new Chart(this.barGraph.nativeElement, {
      type: 'bar',

      data: {
        labels: labels, // courses 
	       datasets: gradeDatasets, // predicted and average data
      },
      options: {
        scales: {
          y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Grade Distribution'
            }
        }
      }
      }
      
    });
  }

  studentInfo(student: any) {
    console.log(student);
    this.data.setStudentId(student.id);
    this.router.navigate(['/student']);
  }
}
