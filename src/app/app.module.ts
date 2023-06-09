import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';

import {ScrollingModule} from '@angular/cdk/scrolling';

import { HeaderComponent } from './components/header/header.component';
import { StudentPageComponent } from './components/student/student-page/student-page.component';
import { TutorPageComponent } from './components/tutor/tutor-page/tutor-page.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentListComponent } from './components/tutor/student-list/student-list.component';
import { StudentInfoComponent } from './components/student/student-info/student-info.component';
import { EngagementInfoComponent } from './components/student/engagement-info/engagement-info.component';
import { AttendanceTabComponent } from './components/student/attendance-tab/attendance-tab.component';
import { GradesTabComponent } from './components/student/grades-tab/grades-tab.component';
import { HistoryTabComponent } from './components/student/history-tab/history-tab.component';
import { ConcernDialogComponent } from './components/concern-dialog/concern-dialog.component';
import { ViewConcernComponent } from './components/view-concern/view-concern.component';
import { TutorInfoComponent } from './components/tutor/tutor-info/tutor-info/tutor-info.component';
import { RegisterTutorComponent } from './components/register-tutor/register-tutor.component';
import { TutorRequestsComponent } from './components/tutor/tutor-requests/tutor-requests.component';
import { TutorCoursesComponent } from './components/tutor/tutor-courses/tutor-courses.component';
import { ReportIssueComponent } from './components/student/report-issue/report-issue.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    StudentPageComponent,
    TutorPageComponent,
    LoginFormComponent,
    StudentListComponent,
    StudentInfoComponent,
    EngagementInfoComponent,
    AttendanceTabComponent,
    GradesTabComponent,
    HistoryTabComponent,
    ConcernDialogComponent,
    ViewConcernComponent,
    TutorInfoComponent,
    RegisterTutorComponent,
    TutorRequestsComponent,
    TutorCoursesComponent,
    ReportIssueComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule, 
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    ScrollingModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
