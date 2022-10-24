import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { StudentPageComponent } from './components/student/student-page/student-page.component';
import { TutorPageComponent } from './components/tutor/tutor-page/tutor-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'student/:id', component: StudentPageComponent },
  { path: 'tutor/:id', component: TutorPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

// const routes: Routes = [
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'detail/:id', component: HeroDetailComponent },
//   { path: 'heroes', component: HeroesComponent }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
