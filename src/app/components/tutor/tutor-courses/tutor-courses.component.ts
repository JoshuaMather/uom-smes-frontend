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
  @ViewChild('barGraphA', {static: true}) barGraphA!: any;

  chart: any;
  chartA: any;
  
  selectedCourse: any;
  selectedView: any = -1;
  loading = false;
  public searchValue: string = '';

  course: any = [];
  students: any = [];
  distribution: any = [];
  expandedStudent: any;
  assignment: any;
  stats: any;
  statsPredicted: any;
  statsCurrent: any;
  total = 0;
  marked = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorA') paginatorA!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('SortA') SortA!: MatSort;
  
  dataSource!: MatTableDataSource<any>;
  dataSourceAssignment!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'attendance', 'currentGrade', 'maxCurrentGrade', 'predictedGrade', 'engagement', 'expand'];
  assignmentColumns: string[] = ['name', 'email', 'year', 'personalTutor', 'dateSubmitted', 'grade', 'final_grade'];

  courseList: any;
  viewList: any;

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
      id: -1,
      course_code: '',
      course_name: 'Select Course' 
    })

    this.selectedCourse = this.courseList[0].id;
  }

  loadCourseInfo() {
    this.api.post(`tutor-course/${this.tutor.tutor.id}/${this.selectedCourse}`).subscribe(res => {
      console.log('RES', res);
      this.course = res.course;
      this.students = res.students;
      this.distribution = res.distribution;
      this.statsPredicted = res.statsPredicted;
      this.statsCurrent = res.statsCurrent;
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

          let mitcircs = assignment.mitcircs;
          assignment.c3 = false;
          assignment.c7 = false;
          mitcircs.forEach((mitcirc:any) => {
            if(mitcirc['type'] == 'C3'){
              assignment.c3=true;
            } else if(mitcirc['type'] == 'C7') {
              assignment.c7=true;
            }
          });
          if(assignment.grade == null){
            assignment.final_grade = null;
          } else{
            let submit = new Date(assignment.date_submitted);
            let due = new Date(assignment.due_date);
            if(submit > due){
              if(assignment.c3){
                assignment.final_grade = assignment.grade;
              } else {
                let diff = Math.abs(submit.getTime() - due.getTime());
                let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
                assignment.diffDays = diffDays;
      
                assignment.final_grade = (assignment.grade) - (assignment.grade * ((diffDays*10)/100));
                if(assignment.grade < 0) {
                  assignment.grade = 0;
                }
              }
            } else {
              assignment.final_grade = assignment.grade;
            }
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
                            data.user.email.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.personal_tutor.user.name.toLowerCase().indexOf(this.searchValue) != -1);
        return searchFilter;
      }

      this.loading = false;
    });
  }

  loadAssignmentInfo() {
    this.api.post(`tutor-course-assignment/${this.tutor.tutor.id}/${this.selectedView}`).subscribe(res => {
      console.log('res', res);
      this.assignment = res.assignment;
      this.students = res.students;
      this.stats = res.stats;
      this.total = res.total;
      this. marked = res.marked;
      this.students.forEach((student: {
        c7: boolean;
        c3: boolean;
        mitcircs: any;
        diffDays: number; date_submitted: string | number | Date; final_grade: number | null; grade: number; 
}) => {
        let mitcircs = student.mitcircs;
        student.c3 = false;
        student.c7 = false;
        mitcircs.forEach((mitcirc:any) => {
          if(mitcirc['type'] == 'C3'){
            student.c3=true;
          } else if(mitcirc['type'] == 'C7') {
            student.c7=true;
          }
        });
        if(student.grade == null){
          student.final_grade = null;
        } else{
          let submit = new Date(student.date_submitted);
          let due = new Date(this.assignment.due_date);
          if(submit > due){
            if(student.c3){
              student.final_grade = student.grade;
            } else {
              let diff = Math.abs(submit.getTime() - due.getTime());
              let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
              student.diffDays = diffDays;
    
              student.final_grade = (student.grade) - (student.grade * ((diffDays*10)/100));
              if(student.final_grade < 0) {
                student.final_grade = 0;
              }
            }
          } else {
            student.final_grade = student.grade;
          }
        }
      });
      this.distribution = res.distribution
      this.createBarAssignment();

      this.dataSourceAssignment = new MatTableDataSource(this.students);
      this.dataSourceAssignment.paginator = this.paginatorA;
      this.dataSourceAssignment.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'name': return  item.user.name;
          case 'email': return  item.user.email;
          case 'personalTutor': return item.personal_tutor.user.name;
          case 'dateSubmitted': return  item.date_submitted;
          case 'grade': return  item.grade;
          case 'final_grade': return  item.final_grade;
          default: return item[property];
          }
        }
      this.dataSourceAssignment.sort = this.SortA;
      this.dataSourceAssignment.filterPredicate = (data: any, filterA: string) => {
        let searchFilter = (data.user.name.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.user.email.toLowerCase().indexOf(this.searchValue) != -1 ||
                            data.personal_tutor.user.name.toLowerCase().indexOf(this.searchValue) != -1);
        return searchFilter;
      }
      this.loading = false;
    });
      
  }

  filter() {
    this.dataSource.filter = 'filter'; // trigger filter
  }

  filterA() {
    this.dataSourceAssignment.filter = 'filter'; // trigger filter
  }

  courseChanged() {
    this.searchValue = '';
    this.selectedView = -1;
    this.viewList=[];
    if(this.selectedCourse===-1){
      return;
    }
    if(this.chart){
      this.chart.destroy();
    }
    if(this.chartA){
      this.chartA.destroy();
    }

    let course = this.courseList.filter( (course: { id: any; }) => { return course.id === this.selectedCourse;});
    course[0].assignments.forEach((assignment: any) => {
      this.viewList.push(assignment)
    });
    this.viewList.unshift({
      id: 0,
      assignment_name: 'Overall' 
    });
    this.viewList.unshift({
      id: -1,
      assignment_name: 'Select View' 
    });
  }

  viewChanged() {
    this.searchValue = '';
    if(this.selectedView===-1){
      return;
    }
    this.loading = true;
    if(this.chart){
      this.chart.destroy();
    }
    if(this.chartA){
      this.chartA.destroy();
    }
    if(this.selectedView===0){
      this.loadCourseInfo();
    } else {
      this.loadAssignmentInfo();
    }
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

  createBarAssignment() {
    let labels: string[] = [];
    let grades: any[] = [];
    let gradeDatasets = [];

    this.distribution.forEach((dist: { label: string; grade: any; }) => {
      labels.push(dist.label);
      grades.push(dist.grade);
    });

    gradeDatasets.push(
      {
        label: 'Grades',
        data: grades
      }, 
    );

    this.chartA = new Chart(this.barGraphA.nativeElement, {
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

  lateDaysTextCalc(submit:any,due:any){
    let submitDate = new Date(submit);
    let dueData = new Date(due);
    let diff = Math.abs(submitDate.getTime() - dueData.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    return "Late Submission: " + diffDays + " Days";
  }

  assignmentGradeTooltip(data:any, due:any){
    let text = '';
    if((data.final_grade!=null && data.final_grade < 0.4)){
      text += "Grade is a fail\n"
    }
    if((data.date_submitted > due) && !data.c3){
      text += "Grade reduced due to late submission: " + data.diffDays*10+"%\n";
    }
    if(data.mitcircs.length>0){
      text += 'Mitigating circumstances applied:\n';
      data.mitcircs.forEach((mitcirc: { type: string; description: string; }) => {
        text += mitcirc.type + ' - ' + mitcirc.description + '\n';
      });
    }
    return text;
  }

  courseGradeTooltip(grades:any){
    let text = '';
    if(grades.current/grades.max_current < 0.4){
      text += "Grade is a fail\n"
    } 
    if(grades.grade_reduced){
      let g = (grades.grade_before_reduction*100).toFixed(0);
      text += "Grade reduced due to late submissions: " + g + "% before reduction\n";
    }
    if(grades.mit_circs.length>0){
      text += 'Mitigating circumstances applied:\n';
      grades.mit_circs.forEach((mitcirc: { type: string; description: string; }) => {
        text += mitcirc + '\n';
      });
    }
    return text;
  }
}
