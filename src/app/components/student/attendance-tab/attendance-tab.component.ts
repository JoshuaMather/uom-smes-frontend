import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-attendance-tab',
  templateUrl: './attendance-tab.component.html',
  styleUrls: ['./attendance-tab.component.scss']
})
export class AttendanceTabComponent implements OnInit {
  @Input() studentInfo : any;
  @ViewChild('lineGraph', {static: true}) lineGraph!: any;
  @ViewChild('radarGraph', {static: true}) radarGraph!: any;

  user: any;

  courseAttendanceInfo: any;
  chart: any;
  
  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();
    this.courseAttendanceCalculate();
    this.createChart();
    if(this.user.tutor.role=='admin'){
      this.createRadar();
    }
  }

  courseAttendanceCalculate() {
      let courseActivityData: any = [];
      this.studentInfo.student_course.forEach((course: any) => {
        let courseAttendance = this.studentInfo.student_activity.filter((activity: { activity: { course: any; }; }) => activity.activity.course === course.course.id);

        // group activity by name
        const groupBy = (array: any[]) => {
          return array.reduce((result, currentValue) => {
            (result[currentValue.activity.activity_name] = result[currentValue.activity.activity_name] || []).push(
              currentValue
            );
            return result;
          }, {});
        };

        const groupedAttnedance = groupBy(courseAttendance);
        
        let activityData = [];
        for(let activity in groupedAttnedance) {
          let activityWeeks = groupedAttnedance[activity];

          var attended = activityWeeks.map(function(activity: { attended: any; }){
            return activity.attended;
          });
          let weekAttendence = (attended.reduce((a: any, b: any) => a + b) / parseFloat(attended.length)).toFixed(2);
          
          activityData.push({activity: activity, weeks: activityWeeks, attendance: weekAttendence});
        }

        var attendances = activityData.map(function(activity){
          return Number(activity.attendance);
        });
        let courseAttendanceValue = (attendances.reduce((a: any, b: any) => a + b) / attendances.length).toFixed(2);

        // get data in required form
        let courseActivityObject = {
          courseName: course.course.course_code + ' ' + course.course.course_name,
          activity: activityData,
          attendance: courseAttendanceValue,
          averageAttendance: course.course.average_attendance
        }

        courseActivityData.push({courseData: courseActivityObject});
      })
      this.courseAttendanceInfo = courseActivityData;

      // get format to use for display

  }

  createChart(){
    let courseAttendanceDatsets: { label: any; data: (number|null)[]; }[] = [];
    this.studentInfo.student_course.forEach((course: any) => {
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
        let weekAttendence;
        if(attended.length==0){
          weekAttendence = null;
        } else {
          weekAttendence = attended.reduce((a: any, b: any) => a + b) / parseFloat(attended.length);
        }
        attendance.push(weekAttendence);
      }
      courseAttendanceDatsets.push({
        label: course.course.course_code + ' ' + course.course.course_name,
        data: attendance,
      });
    });

    this.chart = new Chart(this.lineGraph.nativeElement, {
      type: 'line',

      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12'], 
	       datasets: courseAttendanceDatsets,
      },
      options: {
        scales: {
          y: {
              min: 0,
              beginAtZero: true,
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

  createRadar() {
    // get course labels 
    let labels: any[] = [];
    let studentData: number[] = [];
    let courseAverages: number[] = [];
    this.courseAttendanceInfo.forEach((course: { courseData: { courseName: any; attendance: any; averageAttendance: any; }; }) => {
      labels.push(course.courseData.courseName);

      let courseAttendance = Number(course.courseData.attendance)*100;
      studentData.push(courseAttendance);

      let courseAverage = Number(course.courseData.averageAttendance)*100;
      courseAverages.push(courseAverage);
    });

    this.chart = new Chart(this.radarGraph.nativeElement, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Student Attendance',
            data: studentData,
          },
          {
            label: 'Average Attendance',
            data: courseAverages,
          }
        ]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
        }
        },
      }
    }); 
  }

}
