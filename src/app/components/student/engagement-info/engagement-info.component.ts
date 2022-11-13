import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-engagement-info',
  templateUrl: './engagement-info.component.html',
  styleUrls: ['./engagement-info.component.scss']
})
export class EngagementInfoComponent implements OnInit {
  @Input() studentInfo : any;

  public lastSpot: any = 'Null';
  public lastBlackboard: any = 'Null';
  public lastGit: any = 'Null';

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
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
