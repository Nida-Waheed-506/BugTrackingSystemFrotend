import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Service {
  user_type: string = '';
  loggedInUserInfo$ = new BehaviorSubject<any>(null);
  projectsInfo$ = new BehaviorSubject<any[]>([]);
  projectGetByApi$ = new BehaviorSubject<any[]>([]);
  limitt = new BehaviorSubject<number>(1);
  limitBug = new BehaviorSubject<number>(1);
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
      .post(`${environment.url}/login`, reqBody, { withCredentials: true })
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
    return this.http.get(`${environment.url}/user?id=${id}`, {
      withCredentials: true,
    });
  }
  // get top 5 users

  getTopUsers() {
    return this.http.get(`${environment.url}/users`, {
      withCredentials: true,
    });
  }

  //  get users by name
  getUsersByName(searchingName: any) {
    console.log(searchingName);
    return this.http.get(`${environment.url}/users?search=${searchingName}`, {
      withCredentials: true,
    });
  }
  // user logout

  userLogout() {
    this.http
      .post(`${environment.url}/logout`, '', { withCredentials: true })
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
    return this.http.get(`${environment.url}/auth`, {
      withCredentials: true,
    });
  }

  //  add the project

  addProject(formData: any) {
    return this.http.post(`${environment.url}/project`, formData, {
      withCredentials: true,
    });
  }

  // get all the projects

  getProjects(page: any, limit: any) {
    return this.http.get(
      `${environment.url}/projects?page=${page + 1}&limit=${limit}`,
      { withCredentials: true }
    );
  }

  // assign project

  assignUserToProject(email: string, project_id: any) {
    const reqBody = { email };
    return this.http.post(
      `${environment.url}/projects/${project_id}/assign`,
      reqBody,
      { withCredentials: true }
    );
  }

  //  get top 4 developers in a project

  getTopDevelopers(project_id: any) {
    return this.http.get(
      `${environment.url}/projects/${project_id}/users/developers`,
      { withCredentials: true }
    );
  }

  getDevByName(searchingName: any, project_id: any) {
    return this.http.get(
      `${environment.url}/projects/${project_id}/users/developers?search=${searchingName}`,
      { withCredentials: true }
    );
  }

  createBug(formData: any) {
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return this.http.post(`${environment.url}/bug`, formData, {
      withCredentials: true,
    });
  }

  editBug(formData: any, bug_id: any) {
    return this.http.patch(`${environment.url}/bugs/${bug_id}`, formData, {
      withCredentials: true,
    });
  }
  deleteBug(bug_id: any, project_id: any) {
    const reqBody = { project_id };
    return this.http.delete(
      `${environment.url}/bugs/${bug_id}?project_id=${project_id}`,
      {
        withCredentials: true,
      }
    );
  }
  getProjectBugs(project_id: any, page: any, limit: any) {
    return this.http.get(
      `${environment.url}bugs?project_id=${project_id}&page=${
        page + 1
      }&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
  }

  changeStatus(project_id: any, status: any, bug_id: any) {
    const reqBody = { project_id, status };
    return this.http.patch(
      `${environment.url}/bugs/${bug_id}/status`,
      reqBody,
      {
        withCredentials: true,
      }
    );
  }

  isManagerBelongToProject(project_id: any) {
    return this.http.get(`${environment.url}/projects/${project_id}`, {
      withCredentials: true,
    });
  }

  isQABelongToProject(project_id: any) {
    return this.http.get(`${environment.url}/bugs/${project_id}`, {
      withCredentials: true,
    });
  }

  isQABelongToBug(project_id: any, bug_id: any) {
    return this.http.get(`${environment.url}/bugs/${bug_id}/${project_id}`, {
      withCredentials: true,
    });
  }
}
