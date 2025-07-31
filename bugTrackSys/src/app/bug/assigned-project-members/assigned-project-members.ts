import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { Data } from "../../services/data";
import { CommonModule } from "@angular/common";
import { debounceTime } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-assigned-project-members",
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./assigned-project-members.html",
  styleUrl: "./assigned-project-members.scss",
})
export class AssignedProjectMembers {
  searchName = new FormControl("");
  users: any[] = [];
  projectId: string | null = null;
  selectedUserName = "";
  selectedUserEmail = "";
  constructor(
    private Data: Data,
    private route: ActivatedRoute,
    private ToastrService: ToastrService
  ) {
   
  }



  ngOnInit() {

    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      this.projectId = params.get("project_id");
      console.log("hello");
    });

    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.selectedUserName = "";
        this.selectedUserEmail = "";
        if (value?.trim() === "")
          this.Data.getTopUsers().subscribe({
            next: (response: any) => {
              console.log(response);
              this.users = response.data;
            },
          });
        else {
          this.Data.getUsersByName(value).subscribe({
            next: (response: any) => {
              console.log(response);
              // console.log(response.data[0]);
              this.users = response.data;
            },
          });
        }
      },
    });

    
  }

  onFocus() {
    if (!this.searchName.value) {
      this.Data.getTopUsers().subscribe({
        next: (response: any) => {
          console.log(response.data[0]);
          this.users = response.data;
        },
      });
    }
  }

  onDropdownClick(name: string, email: string) {
    this.selectedUserName = name;
    this.selectedUserEmail = email;
  }

  assignUser() {
   
    if (this.selectedUserEmail.trim() !== ""){}
      // this.Data.assignUserToProject(
      //   this.selectedUserEmail,
      //   this.projectId
      // ).subscribe({
      //   next: (response: any) => {
      //     this.ToastrService.success(response.message, "Success");
      //   },
      //   error: (err: any) => {
      //     this.ToastrService.error(err.error.error, "Error");
      //   },
      // });
  }
}
