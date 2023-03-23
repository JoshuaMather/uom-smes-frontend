import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';
import { ConcernDialogComponent } from '../concern-dialog/concern-dialog.component';
import { ReportIssueComponent } from '../student/report-issue/report-issue.component';
import { ViewConcernComponent } from '../view-concern/view-concern.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  subscriptionRoute!: Subscription;
  public showMenu = false;
  public studentPageTutor = false;
  public studentPageStudent = false;

  constructor(
    private router: Router,
    private data: DataService,
    public dialog: MatDialog,
    private api: ApiService,
  ) { }

  ngOnInit(): void {

    this.subscriptionRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if(event.url === '/' || event.url === '/login'){
          this.showMenu = false;
        } else {
          this.showMenu = true;
        }
        if(event.url === '/student' && this.data.getUser().tutor) {
          this.studentPageTutor = true;
          this.studentPageStudent = false;
        } else if(event.url === '/student' && this.data.getUser().student) {
          this.studentPageTutor = false;
          this.studentPageStudent = true;
        } else if(event.url === '/tutor'){
          this.studentPageTutor = false;
          this.studentPageStudent = false;
        }
      }
    });
  }

  back() {
    this.router.navigateByUrl('/tutor');
  }

  logout() {
    if(confirm("Are you sure you want to logout?")) {
      this.data.logout();
    }
  }

  viewConcerns() {
    if(!this.studentPageTutor) {
      return;
    }
    let student = this.data.getStudentData();
    const dialogRef = this.dialog.open(ViewConcernComponent, {
      // panelClass: 'concern-list-class',
      data: {
        id: student.id,
        name: student.user.name
      }
    });

  }

  reportConcern() {
    if(!this.studentPageTutor) {
      return;
    }
    let student = this.data.getStudentData();
    const dialogRef = this.dialog.open(ConcernDialogComponent, {
      data: {name: student.user.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with concern:', result);
      if(!result){
        return;
      }

      let tutor = this.data.getUser();

      let concernData = {
        student: student.id,
        tutor: tutor.tutor.id,
        concern: result,
      }
      this.api.post('concern', concernData).subscribe(res => {
      });
    });
  }

  reportIssue() {
    if(!this.studentPageStudent) {
      return;
    }

    let student = this.data.getStudentData();
    const dialogRef = this.dialog.open(ReportIssueComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with concern:', result);
      if(!result){
        return;
      }

      let issueData = {
        student: student.id,
        issue: result,
      }
      this.api.post('issue', issueData).subscribe(res => {
      });
    });
  }


}
