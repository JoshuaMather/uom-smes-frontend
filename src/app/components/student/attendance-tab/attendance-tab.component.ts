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

  selectedCourse = '';
  courseAttendanceInfo: any;
  coursesLabelList:any;
  chart: any;
  
  constructor(
    // private chart: Chart,
  ) { }

  ngOnInit(): void {
    this.courseAttendanceCalculate();
    this.createChart();
    this.coursesLabelList = this.studentInfo.student_course;
    this.coursesLabelList.unshift({
      course: {
        course_name: 'Overall',
        id: ''
      },
    });
  }

  courseAttendanceCalculate() {
    if(this.selectedCourse===''){
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
        console.log(attendances);
        console.log(courseAttendanceValue);
        courseActivityData.push({[course.course.course_name]: activityData});
      })
      console.log('bbb', courseActivityData);
      this.courseAttendanceInfo = courseActivityData;

      // get format to use for display

    }
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
