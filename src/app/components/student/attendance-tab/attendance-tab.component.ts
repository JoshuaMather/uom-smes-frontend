import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-attendance-tab',
  templateUrl: './attendance-tab.component.html',
  styleUrls: ['./attendance-tab.component.scss']
})
export class AttendanceTabComponent implements OnInit {
  @Input() studentInfo : any;
  @ViewChild('lineGraph', {static: true}) lineGraph!: any;

  chart: any;
  
  constructor(
    // private chart: Chart,
  ) { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    let courseAttendanceDatsets: { label: any; data: number[]; }[] = [];
    this.studentInfo.student_course.forEach((course: any) => {
      console.log(course.course);
      // for each week of the course get attendance 
      let attendance = [];
      let courseAttendance = this.studentInfo.student_activity.filter((activity: { activity: { course: any; }; }) => activity.activity.course === course.course.id);
      for (let index = 1; index < 13; index++) {
        let week = courseAttendance.filter((activity: { week: number; }) => activity.week == index);
        if(!week) {
          attendance.push(0);
          continue;
        }
        var attended = week.map(function(activity: { attended: any; }){
          return activity.attended;
        });
        let weekAttendence = attended.reduce((a: any, b: any) => a + b) / parseFloat(attended.length);

        attendance.push(weekAttendence);
      }
      courseAttendanceDatsets.push({
        label: course.course.course_name,
        data: attendance,
      });
      
    });
    console.log(courseAttendanceDatsets);

    this.chart = new Chart(this.lineGraph.nativeElement, {
      type: 'line',

      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12'], 
	       datasets: courseAttendanceDatsets,
      },
      options: {
        scales: {
          y: {
              beginAtZero: true,
              max: 1,
              title: {
                display: true,
                text: 'Attendance'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Week'
            }
        }
      }
      }
      
    });
  }

}
