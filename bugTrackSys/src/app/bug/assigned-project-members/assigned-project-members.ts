import { Component , Inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { Data } from "../../services/data";
import { CommonModule } from "@angular/common";
import { debounceTime } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: "app-assigned-project-members",
  imports: [ReactiveFormsModule, CommonModule , MatIconModule],
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
    @Inject(MAT_DIALOG_DATA) public data:any ,
    private Data: Data,
    private ToastrService: ToastrService,
    public dialogRef : MatDialogRef<AssignedProjectMembers>
  ) {
   this.projectId = this.data.projectId;
  }



  ngOnInit() {


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

  // when input is focused show top 5 users
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

  // when select any of the user from the drop down

  onDropdownClick(name: string, email: string) {
    this.selectedUserName = name;
    this.selectedUserEmail = email;
  }

  // when click on assign user btn
  assignUser() {
   
    if (this.selectedUserEmail.trim() !== ""){}
      this.Data.assignUserToProject(
        this.selectedUserEmail,
        this.projectId
      ).subscribe({
        next: (response: any) => {
          this.ToastrService.success(response.message, "Success");
        },
        error: (err: any) => {
          this.ToastrService.error(err.error.error, "Error");
        },
      });
  }

  // dialog box is closed

  onCloseDialog(){
    this.dialogRef.close('assign project dialog closed');
  }
}
