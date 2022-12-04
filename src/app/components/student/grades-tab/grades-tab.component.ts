import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-grades-tab',
  templateUrl: './grades-tab.component.html',
  styleUrls: ['./grades-tab.component.scss']
})
export class GradesTabComponent implements OnInit {
  @Input() studentInfo : any;

  user: any;
  courseAssignmentInfo: any;

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();
    this.getGradeData();
  }

  getGradeData() {
    let courseAssignmentData: any = [];
    this.studentInfo.student_course.forEach((course: { course: { id: any; course_name: any; }; predicted_grade: any; }) => {
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
        course: course.course.course_name,
        predictedGrade: course.predicted_grade,
        assignments: assignmentData,
      });
    });
    console.log(courseAssignmentData);
    this.courseAssignmentInfo = courseAssignmentData;
  }

}
