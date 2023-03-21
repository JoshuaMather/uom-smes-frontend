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
  public gradeReduced = false;
  public maxCurrent = 0;
  public unreduced = 0;
  public mitCirc = false;

  constructor(
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.user = this.data.getUser();

    this.attendance = Math.round(this.studentInfo.engagement.attendance * 100);
    this.currentGrade = Math.round(this.studentInfo.engagement.current * 100);
    this.predictedGrade = Math.round(this.studentInfo.engagement.predict * 100);
    this.engagement = Math.round(this.studentInfo.engagement.engagement * 100);
    this.gradeReduced = this.studentInfo.engagement.grade_reduced;
    this.maxCurrent = Math.round(this.studentInfo.engagement.max_current * 100);
    this.unreduced = Math.round(this.studentInfo.engagement.grade_before_reduction * 100);
    this.mitCirc = this.studentInfo.engagement.mit_circs;

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

  gradeTooltip(grade:any, max:any, reduced:any, unreducedGrade:any,mitCircs:any){
    let text = '';
    if(grade/max < 0.4){
      text += "Grade is a fail\n"
    }
    if(reduced  && grade!=unreducedGrade){
      let g = (unreducedGrade);
      text += "Grade reduced due to late submissions: " + g + "% before reduction\n";
    }
    if(mitCircs) {
      text += 'Mitigating circumstances applied - see grades for more info\n';
    }
    return text;
  }

}
