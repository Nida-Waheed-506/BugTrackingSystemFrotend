import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { PageNotFound } from './page-not-found/page-not-found';
import { Project } from './project/project';
import { Bug } from './bug/bug';
import { AssignedProjectMembers } from './bug/assigned-project-members/assigned-project-members';

// +++++++++++++++++++++++++++ imports ends ++++++++++++++++++++++++++++++

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'projects', component: Project },
  { path: 'projects/:project_id/bugs', component: Bug },
  { path: '**', component: PageNotFound },
];
