import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-grades-tab',
  templateUrl: './grades-tab.component.html',
  styleUrls: ['./grades-tab.component.scss']
})
export class GradesTabComponent implements OnInit {
  @Input() studentInfo : any;
  @ViewChild('barGraph', {static: true}) barGraph!: any;

  user: any;
  courseAssignmentInfo: any;

  chart: any;

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();
    this.getGradeData();
    this.createBar();
  }

  getGradeData() {
    let courseAssignmentData: any = [];
    this.studentInfo.student_course.forEach((course: { course: { id: any; course_code: string; course_name: string; }; grades: { current: any; predict: any; }; }) => {
      let courseAssignments = this.studentInfo.student_assignment.filter((assignment: { assignment: { course: { id: any; }; }; }) => assignment.assignment.course.id === course.course.id);

      let assignmentData: any = [];
      let formative: { assignmentName: any; type: any; grade: any; dueDate: any; submittedDate: any; }[] = [];
      let summative: { assignmentName: any; type: any; grade: any; dueDate: any; submittedDate: any; }[] = []
      courseAssignments.forEach((element: { assignment: { assignment_name: any; type: any; due_date: any; }; grade: any; date_submitted: any; }) => {
        if(element.assignment.type.includes('_f')){
          formative.push({
            assignmentName: element.assignment.assignment_name,
            type: element.assignment.type,
            grade: (element.grade*100).toFixed(0),
            dueDate: element.assignment.due_date,
            submittedDate: element.date_submitted,
          });
        } else if(element.assignment.type.includes('_s')) {
          summative.push({
            assignmentName: element.assignment.assignment_name,
            type: element.assignment.type,
            grade: (element.grade*100).toFixed(0),
            dueDate: element.assignment.due_date,
            submittedDate: element.date_submitted,
          });
        }
      });

      assignmentData.push({
        summative: summative,
        formative: formative,
      })

      courseAssignmentData.push({
        course: course.course.course_code + ' ' + course.course.course_name,
        currentGrade: course.grades.current,
        predictedGrade: course.grades.predict,
        assignments: assignmentData,
      });
    });
    console.log(courseAssignmentData);
    this.courseAssignmentInfo = courseAssignmentData;
  }

  createBar() {
    let courseLabel: string[] = [];
    let currentGrades: any[] = [];
    let predictedGrades: any[] = [];
    let gradeDatasets = [];

    this.courseAssignmentInfo.forEach((courseInfo: { course: string; currentGrade: any; predictedGrade: any; }) => {
      courseLabel.push(courseInfo.course);
      currentGrades.push(courseInfo.currentGrade);
      predictedGrades.push(courseInfo.predictedGrade);
    });

    gradeDatasets.push(
      {
        label: 'Current Grades',
        data: currentGrades
      }, 
      {
        label: 'Predicted Grades',
        data: predictedGrades
      });

    this.chart = new Chart(this.barGraph.nativeElement, {
      type: 'bar',

      data: {
        labels: courseLabel, // courses 
	       datasets: gradeDatasets, // predicted and average data
      },
      options: {
        scales: {
          y: {
              max: 1,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'Grade'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Course'
            }
        }
      }
      }
      
    });
  }
}
