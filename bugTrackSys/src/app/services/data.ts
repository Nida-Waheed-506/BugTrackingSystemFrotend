import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Data {
  user_type: string = "";
  data : any = "";
 projectsInfo$ = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient , private ToastrService:ToastrService , private Router: Router) {}

  // sign up the user

  addUser(
    name: string,
    mobile_number: string,
    email: string,
    password: string
  ):void {
    const reqBody = {
      name: name,
      mobile_number: mobile_number,
      email: email,
      password: password,
      user_type: this.user_type,
    };
    // api call made
  this.http.post("http://localhost:8000/signup", reqBody).subscribe({
  next: (response:any) => {
   
    this.ToastrService.success(  response.message   , 'Success');
    this.Router.navigate(['/project']);

  },
  error: (err) => {
   
    this.ToastrService.error( err.error.error, 'Error');
  },
 
});
  }



  // sign in the user

  getUser(email:string , password : string):void{
   
    const reqBody = {
      email : email,
      password:password
    }
    this.http.post("http://localhost:8000/login" , reqBody ,  { withCredentials: true }).subscribe({
      next: (response:any)=>{
       
       this.data = response.data;
       this.ToastrService.success(response.message , "Success");
       this.Router.navigate(['/projects']);
      },
      error:(err)=>{
        this.ToastrService.error(err.error.error , 'Error');
      }
    });
  }



//  add the project

addProject(formData:any){

  


   this.http.post("http://localhost:8000/project" , formData, {withCredentials:true}).subscribe({
      next: (response:any)=>{
       
     
       this.ToastrService.success(response.message , "Success");
       this.Router.navigate(['/projects']);
      },
      error:(err)=>{
        this.ToastrService.error(err.error.error , 'Error');
      }
    });
}


// get all the projects 


getProjects(){
    this.http.get("http://localhost:8000/projects" ,  {withCredentials:true}).subscribe({
      next: (response:any)=>{
      console.log(response);
        this.projectsInfo$.next(response.data);
       this.ToastrService.success(response.message , "Success");
       this.Router.navigate(['/projects']);
      },
      error:(err)=>{
        this.ToastrService.error(err.error.error , 'Error');
      }
    });
}








}



// // WRONG: Logging the observable object
// const data$ = this.http.get('/api/data');
// console.log(data$); // <-- just shows Observable2 {...}, no request executed
