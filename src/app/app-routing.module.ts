import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { StudentPageComponent } from './components/student/student-page/student-page.component';
import { TutorPageComponent } from './components/tutor/tutor-page/tutor-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'student', component: StudentPageComponent },
  { path: 'tutor', component: TutorPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
