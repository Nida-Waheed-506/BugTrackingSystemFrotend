import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { PageNotFound } from './page-not-found/page-not-found';
import { Project } from './project/project';
import { Bug } from './bug/bug';
import { authGuard } from './auth-guard';
// +++++++++++++++++++++++++++ imports ends ++++++++++++++++++++++++++++++

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'projects', component: Project, canActivate: [authGuard] },
  {
    path: 'projects/:project_id/bugs',
    component: Bug,
    canActivate: [authGuard],
  },
  { path: '**', component: PageNotFound },
];


