import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ProjectService } from '../../services/project/project';
import { User } from '../../services/user/user';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

// ....................... imports ends here..............................

@Component({
  selector: 'app-assigned-project-members',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './assigned-project-members.html',
  styleUrl: './assigned-project-members.scss',
})
export class AssignedProjectMembers implements OnInit {
  // component variable

  searchName = new FormControl('');
  users: any[] = [];
  projectId: string | null = null;
  selectedUserName = '';
  selectedUserEmail = '';

  // constructor

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog_Data: any,
    private project_service: ProjectService,
    private user_service: User,
    private ToastrService: ToastrService,
    public dialogRef: MatDialogRef<AssignedProjectMembers>
  ) {
    this.projectId = this.dialog_Data.projectId;
  }

  ngOnInit() {
    // when search the name  of users and remove the name

    this.searchName.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.selectedUserName = '';
        this.selectedUserEmail = '';
        if (value?.trim() === '')
          this.user_service.getTopUsers().subscribe({
            next: (response: any) => {
              this.users = response.data;
            },
          });
        else {
          this.user_service.getUsersByName(value).subscribe({
            next: (response: any) => {
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
      this.user_service.getTopUsers().subscribe({
        next: (response: any) => {
          this.users = response.data;
        },
      });
    }
  }

  // when select any of the user from the drop down

  onDropdownClick(name: string, email: string) {
    this.selectedUserName = name;
    this.selectedUserEmail = email;
    this.users = [];
  }

  // when click on assign user btn
  assignUser() {
    this.users = [];

    if (this.selectedUserEmail.trim() !== '') {
      this.project_service
        .assignUserToProject(this.selectedUserEmail, this.projectId)
        .subscribe({
          next: (response: any) => {
            this.ToastrService.success(response.message, 'Success');
          },
          error: (err: any) => {
            this.ToastrService.error(err.error.error, 'Error');
          },
        });
    } else {
      this.ToastrService.error('Choose User first', 'Error');
    }
  }

  // dialog box is closed

  onCloseDialog() {
    this.dialogRef.close('assign project dialog closed');
  }
}
