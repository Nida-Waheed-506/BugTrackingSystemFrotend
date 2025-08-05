import { Component } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { MatDialog } from '@angular/material/dialog';
import { AssignedProjectMembers } from './assigned-project-members/assigned-project-members';
import { AddBug } from './add-bug/add-bug';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Data } from '../services/data';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-bug',
  imports: [Navbar, CommonModule],
  templateUrl: './bug.html',
  styleUrl: './bug.scss',
})
export class Bug {
  project_id: string | null = null;
  bugDetails: any[] = [];
  constructor(
    private ToastrService: ToastrService,
    private Data: Data,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.project_id = params.get('project_id');
    });

    //  to get the bugs

    this.Data.getProjectBugs(this.project_id).subscribe({
      next: (response: any) => {
        const bugs = response.data.Bugs;

        Promise.all(
          bugs.map(async (bug: any) => {
            const developerNames: string[] = [];

            for (const devId of bug.developer_id) {
              try {
                const userRes: any = await lastValueFrom(
                  this.Data.getUserById(devId)
                );

                developerNames.push(userRes.data.name);
              } catch (error) {
                console.error(error);
              }
            }

            return {
              ...bug,
              developerNames: developerNames.join(' - '),
            };
          })
        ).then((bugDet) => {
          this.bugDetails = bugDet;
        });
      },
      error: (err: any) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }
  openAddMembersToProjectDialog() {
    const dialogRef = this.dialog.open(AssignedProjectMembers, {
      backdropClass: 'popup',
      autoFocus: false,
      data: {
        projectId: this.project_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddBugDialog() {
    const dialogRef = this.dialog.open(AddBug, {
      backdropClass: 'popup',
      autoFocus: false,
      data: {
        projectId: this.project_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
