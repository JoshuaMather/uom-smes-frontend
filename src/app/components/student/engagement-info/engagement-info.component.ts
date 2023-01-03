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

  public currentGrade = 0;
  public predictedGrade = 0;
  public attendance = 0;
  public engagement = 0;

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();

    this.attendance = Math.round(this.studentInfo.engagement.attendance * 100);
    this.currentGrade = Math.round(this.studentInfo.engagement.current * 100);
    this.predictedGrade = Math.round(this.studentInfo.engagement.predict * 100);
    this.engagement = Math.round(this.studentInfo.engagement.engagement * 100);

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
