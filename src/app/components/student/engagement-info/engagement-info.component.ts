import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-engagement-info',
  templateUrl: './engagement-info.component.html',
  styleUrls: ['./engagement-info.component.scss']
})
export class EngagementInfoComponent implements OnInit {
  @Input() studentInfo : any;

  public user: any;

  public lastSpot: any = 'Null';
  public lastBlackboard: any = 'Null';
  public lastGit: any = 'Null';

  public predictedGrade = 0;
  public attendance = 0;

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();

    this.attendance = Math.round(this.studentInfo.attendance * 100);
    this.predictedGrade = Math.round(this.studentInfo.predicted_grade * 100);

    // get last logins: SPOT, Blackboard, Git push
    let history = this.studentInfo.student_last;
    let lastSpot = history.find((e: { type: string; }) => {return e.type == 'spot'});
    if(lastSpot) {
      this.lastSpot = lastSpot.datetime;
    }
    let lastBlackboard = history.find((e: { type: string; }) => {return e.type == 'blackboard'});
    if(lastBlackboard) {
      this.lastBlackboard = lastBlackboard.datetime;
    }
    let lastGit = history.find((e: { type: string; }) => {return e.type == 'git'});
    if(lastGit) {
      this.lastGit = lastGit.datetime;
    }
  }

}
