import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class User {
  user_type = '';
  loggedInUserInfo$ = new BehaviorSubject<any>(null);

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
    this.http.post('http://localhost:8000/signup', reqBody).subscribe({
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
    this.http.post(`${environment.url}/login`, reqBody).subscribe({
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
    return this.http.get(`${environment.url}/user?id=${id}`);
  }
  // get top 5 users

  getTopUsers() {
    return this.http.get(`${environment.url}/users`);
  }

  //  get users by name
  getUsersByName(searchingName: any) {
    return this.http.get(`${environment.url}/users?search=${searchingName}`);
  }
  // user logout

  userLogout() {
    this.http.post(`${environment.url}/logout`, '').subscribe({
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
}
