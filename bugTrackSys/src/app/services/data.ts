import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class Data {
  user_type: string = '';
  loggedInUserInfo$ = new BehaviorSubject<any>(null);
  projectsInfo$ = new BehaviorSubject<any[]>([]);
  constructor(
    private http: HttpClient,
    private ToastrService: ToastrService,
    private Router: Router
  ) {}

  // sign up the user

  addUser(
    name: string,
    mobile_number: string,
    email: string,
    password: string
  ): void {
    const reqBody = {
      name: name,
      mobile_number: mobile_number,
      email: email,
      password: password,
      user_type: this.user_type,
    };
    // api call made
    this.http
      .post('http://localhost:8000/signup', reqBody, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.loggedInUserInfo$.next(response.data);
          this.ToastrService.success(response.message, 'Success');
          this.Router.navigate(['/projects']);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
  }

  // sign in the user

  getUser(email: string, password: string): void {
    const reqBody = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:8000/login', reqBody, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.loggedInUserInfo$.next(response.data);
          this.ToastrService.success(response.message, 'Success');
          this.Router.navigate(['/projects']);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
  }

  getUserById(id: any) {
    return this.http.get(`http://localhost:8000/user?id=${id}`, {
      withCredentials: true,
    });
  }
  // get top 5 users

  getTopUsers() {
    return this.http.get('http://localhost:8000/users', {
      withCredentials: true,
    });
  }

  //  get users by name
  getUsersByName(searchingName: any) {
    console.log(searchingName);
    return this.http.get(
      `http://localhost:8000/users?search=${searchingName}`,
      { withCredentials: true }
    );
  }
  // user logout

  userLogout() {
    this.http
      .post('http://localhost:8000/logout', '', { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.loggedInUserInfo$.next(null);
          this.ToastrService.success(response.message, 'Success');
          this.Router.navigate(['/login']);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });
  }

  //  check if user is authenticated
  checkAuth() {
    return this.http.get('http://localhost:8000/auth', {
      withCredentials: true,
    });
  }

  //  add the project

  addProject(formData: any) {
    return this.http.post('http://localhost:8000/project', formData, {
      withCredentials: true,
    });
  }

  // get all the projects

  getProjects( page : any, limit:any) {
 
   return this.http
      .get(`http://localhost:8000/projects?page=${page+1}&limit=${limit}`, { withCredentials: true })
    
  }

  // assign project

  assignUserToProject(email: string, project_id: any) {
    const reqBody = { email };
    return this.http.post(
      `http://localhost:8000/projects/${project_id}/assign`,
      reqBody,
      { withCredentials: true }
    );
  }

  //  get top 4 developers in a project

  getTopDevelopers(project_id: any) {
    return this.http.get(
      `http://localhost:8000/projects/${project_id}/users/developers`,
      { withCredentials: true }
    );
  }

  getDevByName(searchingName: any, project_id: any) {
    return this.http.get(
      `http://localhost:8000/projects/${project_id}/users/developers?search=${searchingName}`,
      { withCredentials: true }
    );
  }

  createBug(formData: any) {
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return this.http.post('http://localhost:8000/bug', formData, {
      withCredentials: true,
    });
  }

  getProjectBugs(project_id: any , page:any , limit:any) {
    return this.http.get(
      `http://localhost:8000/bugs?project_id=${project_id}&page=${page+1}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
  }

  changeStatus(project_id: any, status: any, bug_id: any) {
    const reqBody = { project_id, status };
    return this.http.patch(`http://localhost:8000/bugs/${bug_id}/status`, reqBody, {
      withCredentials: true,
    });
  }
  
}
