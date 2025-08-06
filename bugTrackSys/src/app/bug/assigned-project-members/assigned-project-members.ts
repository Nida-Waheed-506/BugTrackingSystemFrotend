import { Component , Inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { Service } from "../../services/service";
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
    @Inject(MAT_DIALOG_DATA) public dialog_Data:any ,
    private Service: Service,
    private ToastrService: ToastrService,
    public dialogRef : MatDialogRef<AssignedProjectMembers>
  ) {
   this.projectId = this.dialog_Data.projectId;
  }



  ngOnInit() {


    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.selectedUserName = "";
        this.selectedUserEmail = "";
        if (value?.trim() === "")
          this.Service.getTopUsers().subscribe({
            next: (response: any) => {
              console.log(response);
              this.users = response.data;
            },
          });
        else {
          this.Service.getUsersByName(value).subscribe({
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
      this.Service.getTopUsers().subscribe({
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
      this.Service.assignUserToProject(
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
