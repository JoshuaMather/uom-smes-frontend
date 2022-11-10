import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss']
})
export class StudentInfoComponent implements OnInit {
  @Input() studentInfo : any;
  public lastSpot: any = 'Null';
  public lastBlackboard: any = 'Null';
  public lastGit: any = 'Null';

  constructor() { }

  ngOnInit(): void {
    console.log(this.studentInfo);
    // get last logins: SPOT, Blackboard, Git push
    let history = this.studentInfo.student_last;
    this.lastSpot =history.find((e: { type: string; }) => {return e.type == 'spot'});
    this.lastBlackboard =history.find((e: { type: string; }) => {return e.type == 'blackboard'});
    this.lastGit =history.find((e: { type: string; }) => {return e.type == 'git'});

  }

}
