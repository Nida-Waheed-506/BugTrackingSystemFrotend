import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { response } from "express";

@Injectable({
  providedIn: "root",
})
export class Data {
  user_type: string = "";
  loggedInUserInfo$ = new BehaviorSubject<string>("");
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
      .post("http://localhost:8000/signup", reqBody, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, "Success");
          this.Router.navigate(["/project"]);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, "Error");
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
      .post("http://localhost:8000/login", reqBody, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.loggedInUserInfo$ = response.data;
          this.ToastrService.success(response.message, "Success");
          this.Router.navigate(["/projects"]);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, "Error");
        },
      });
  }
// get top 5 users

getTopUsers(){
 return this.http.get("http://localhost:8000/users" , {withCredentials:true});
}

//  get users by name
getUsersByName(searchingName:any){

  console.log(searchingName);
  return this.http.get(`http://localhost:8000/users?search=${searchingName}` , {withCredentials:true});
}
  // user logout

  userLogout() {
    this.http
      .post("http://localhost:8000/logout", "", { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, "Success");
          this.Router.navigate(["/login"]);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, "Error");
        },
      });
  }

  //  add the project

  addProject(formData: any) {
    console.log(this.loggedInUserInfo$);
    this.http
      .post("http://localhost:8000/project", formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, "Success");
          this.Router.navigate(["/projects"]);
        },
        error: (err) => {
          this.ToastrService.error(err.error.error, "Error");
        },
      });
  }

  // get all the projects

  getProjects() {
    this.http
      .get("http://localhost:8000/projects", { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.projectsInfo$.next(response.data[0]);

          //  this.ToastrService.success(response.message , "Success");
          this.Router.navigate(["/projects"]);
        },
        error: (err) => {
          if (err.status === 401) {
            this.ToastrService.error(
              "Session expired. Please log in again.",
              "Unauthorized"
            );
            this.Router.navigate(["/login"]);
          } else this.ToastrService.error(err.error.error, "Error");
        },
      });
  }


  // assign project

  assignUserToProject(email:string , project_id:string){
    const reqBody = {email};
    this.http.post(`http://localhost:8000/projects/${project_id}/assign` , reqBody , {withCredentials:true});
  }


   
  



}




// // WRONG: Logging the observable object
// const data$ = this.http.get('/api/data');
// console.log(data$); // <-- just shows Observable2 {...}, no request executed
