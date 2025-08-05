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
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-bug',
  imports: [Navbar, CommonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './bug.html',
  styleUrl: './bug.scss',
})
export class Bug {
  project_id: string | null = null;
  projectName: string = '';
  bugDetails: any[] = [];
  isChangeStatus: any = false;
  chosenBug: any = '';
  currentPageNumber: any = 0;
  limitt: any = 1;
  totalRecords: any = 0;

  constructor(
    private ToastrService: ToastrService,
    private Data: Data,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      this.project_id = params.get('project_id');
    });

    this.route.queryParams.subscribe((query) => {
      this.projectName = query['project'];
    });

    this.Data.getProjectBugs(
      this.project_id,
      this.currentPageNumber,
      this.limitt
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.totalRecords = response.data.count;

        const bugs = response.data.rows;
        console.log(bugs);
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

  // page number get for pagination

  onPageChange(event: PageEvent): void {
    this.currentPageNumber = event.pageIndex;
    this.limitt = event.pageSize;
    this.totalRecords = event.length;


    this.Data.getProjectBugs(
      this.project_id,
      this.currentPageNumber,
      this.limitt
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.totalRecords = response.data.count;

        const bugs = response.data.rows;
        console.log(bugs);
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

  showChangeStatus(chosenBug: any) {
    console.log(chosenBug);
    this.chosenBug = chosenBug;
  }
  choosenStatus(id: any, status: any) {
    this.Data.changeStatus(this.project_id, status, id).subscribe({
      next: (response: any) => {
        this.bugDetails = this.bugDetails.map((bug) => {
          if (bug.id === id && bug.status !== status) {
            return {
              ...bug,
              status: status,
            };
          }
          return bug;
        });
      },
      error: (err) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
    this.chosenBug = '';
  }

  closeChangeStatus() {
    this.chosenBug = '';
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
