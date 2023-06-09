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
    this.studentInfo.student_course.forEach((course: { course: {
      average_grades: any; id: any; tutor: any; course_code: string; course_name: string; 
}; grades: { current: any; predict: any; }; }) => {
      let courseAssignments = this.studentInfo.student_assignment.filter((assignment: { assignment: { course: { id: any; }; }; }) => assignment.assignment.course === course.course.id);

      let assignmentData: any = [];
      let formative: { assignmentName: any; type: string | string[]; grade: number | null; final_grade: number | null; dueDate: any; submittedDate: any; mitcircs:any; diffDays:any; c3:any;}[]  = [];
      let summative: { assignmentWeight: number; assignmentName: any; type: string | string[]; grade: number | null; final_grade: number | null; dueDate: any; submittedDate: any;  mitcircs:any; diffDays:any; c3:any;}[] = []
      let summativeWeight = 0;
      courseAssignments.forEach((element: {
        diffDays: number;
        mitcircs: any;
        c3: boolean;
        c7: boolean; assignment: { type: string | string[]; assignment_name: any; due_date: any; engagement_weight: number; }; grade: number; date_submitted: any; 
}) => {
        let grade;
        let final_grade;

        let mitcircs = element.mitcircs;
        element.c3 = false;
        element.c7 = false;
        mitcircs.forEach((mitcirc:any) => {
          if(mitcirc['type'] == 'C3'){
            element.c3=true;
          } else if(mitcirc['type'] == 'C7') {
            element.c7=true;
          }
        });

        if(element.grade===null){ 
          grade = null;
          final_grade = null;
        } else {
          grade = (element.grade*100);
          let submit = new Date(element.date_submitted);
          let due = new Date(element.assignment.due_date);
          if(submit > due){
            if(element.c3){
              final_grade = grade;
            } else {
              let diff = Math.abs(submit.getTime() - due.getTime());
              let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
              element.diffDays = diffDays;
    
              final_grade = (grade) - (grade * ((diffDays*10)/100));
              if(final_grade < 0) {
                final_grade = 0;
              }
            }
          } else {
            final_grade = grade;
          }
        }

        if(element.assignment.type.includes('_f')){
          formative.push({
            assignmentName: element.assignment.assignment_name,
            type: element.assignment.type,
            grade: grade,
            final_grade: final_grade,
            dueDate: element.assignment.due_date,
            submittedDate: element.date_submitted,
            mitcircs: element.mitcircs,
            diffDays: element.diffDays,
            c3: element.c3
          });
        } else if(element.assignment.type.includes('_s')) {
          summativeWeight += element.assignment.engagement_weight;
          summative.push({
            assignmentWeight: element.assignment.engagement_weight,
            assignmentName: element.assignment.assignment_name,
            type: element.assignment.type,
            grade: grade,
            final_grade: final_grade,
            dueDate: element.assignment.due_date,
            submittedDate: element.date_submitted,
            mitcircs: element.mitcircs,
            diffDays: element.diffDays,
            c3: element.c3
          });
        }
      });

      assignmentData.push({
        summative: summative,
        formative: formative,
        summativeWeight: summativeWeight,
      })

      if(this.user.tutor && this.user.tutor.role==='admin'){
        courseAssignmentData.push({
          course: course.course.course_code + ' ' + course.course.course_name,
          currentGrade: course.grades.current,
          averageCurrent: course.course.average_grades.current,
          predictedGrade: course.grades.predict,
          averagePredicted: course.course.average_grades.predict,
          assignments: assignmentData,
        });
      } else {
        courseAssignmentData.push({
          course: course.course.course_code + ' ' + course.course.course_name,
          currentGrade: course.grades.current,
          predictedGrade: course.grades.predict,
          assignments: assignmentData,
        });
      }

    });
    console.log(courseAssignmentData);
    this.courseAssignmentInfo = courseAssignmentData;
  }

  createBar() {
    let courseLabel: string[] = [];
    let currentGrades: any[] = [];
    let predictedGrades: any[] = [];
    let currentGradesAverage: any[] = [];
    let predictedGradesAverage: any[] = [];
    let gradeDatasets = [];

    this.courseAssignmentInfo.forEach((courseInfo: {
      averageCurrent(averageCurrent: any): unknown;
      averagePredicted(averagePredicted: any): unknown; course: string; currentGrade: any; predictedGrade: any; 
}) => {
      courseLabel.push(courseInfo.course);
      currentGrades.push(courseInfo.currentGrade);
      if(this.user.tutor && this.user.tutor.role==='admin'){
        currentGradesAverage.push(courseInfo.averageCurrent);
      }
      predictedGrades.push(courseInfo.predictedGrade);
      if(this.user.tutor && this.user.tutor.role==='admin'){
        predictedGradesAverage.push(courseInfo.averagePredicted);
      }
    });

    if(this.user.tutor && this.user.tutor.role==='admin'){
      gradeDatasets.push(
        {
          label: 'Current Grades',
          data: currentGrades
        }, 
        {
          label: 'Average Current Grades',
          data: currentGradesAverage
        }, 
        {
          label: 'Predicted Grades',
          data: predictedGrades
        },
        {
          label: 'Average Predicted Grades',
          data: predictedGradesAverage
        },
        );
    } else {
      gradeDatasets.push(
        {
          label: 'Current Grades',
          data: currentGrades
        }, 
        {
          label: 'Predicted Grades',
          data: predictedGrades
        });
    }


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

  lateDaysTextCalc(submit:any,due:any){
    let submitDate = new Date(submit);
    let dueData = new Date(due);
    let diff = Math.abs(submitDate.getTime() - dueData.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    return "Late Submission: " + diffDays + " Days";
  }

  assignmentGradeTooltip(data:any){
    let text = '';
    if((data.final_grade!=null && data.final_grade < 40)){
      text += "Grade is a fail\n"
    }
    if((data.submittedDate > data.dueDate) && !data.c3){
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
}
