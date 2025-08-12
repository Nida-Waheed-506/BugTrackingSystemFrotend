import { Component } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { MatDialog } from '@angular/material/dialog';
import { AssignedProjectMembers } from './assigned-project-members/assigned-project-members';
import { AddBug } from './add-bug/add-bug';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Service } from '../services/service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { debounceTime, lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// ...................imports ends ............................

@Component({
  selector: 'app-bug',
  imports: [
    Navbar,
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bug.html',
  styleUrl: './bug.scss',
})
export class Bug {

  // component variable

  project_id: string | null = null;
  projectName: string = '';
  bugDetails: any[] = [];
  bugDetailsFromApi: any[] = [];
  isChangeStatus: any = false;
  chosenBug: any = '';
  currentPageNumber: any = 0;
  limitt: any = 1;
  totalRecords: any = 0;
  searchControl = new FormControl('');
  assignBtn = false;
  addTask = false;


  // constructor 

  constructor(
    private ToastrService: ToastrService,
    private Service: Service,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    // get the limit of bugs

    this.Service.limitBug.subscribe((value)=>{
      this.limitt = value;
    })

    // to get the path params

    this.route.paramMap.subscribe((params: ParamMap) => {
     
      this.project_id = params.get('project_id');
    });

    // to get the query params

    this.route.queryParams.subscribe((query) => {
      this.projectName = query['project'];
    });

    // get project bugs

    this.getBugs(this.limitt);

    //  check valid manager or is manager

    this.Service.isManagerBelongToProject(this.project_id).subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        this.assignBtn = true;
        console.log(err);
      },
    });

    //  check valid QA and is QA

    this.Service.isQABelongToProject(this.project_id).subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        this.addTask = true;
        console.log(err);
      },
    });

    //  search the bug
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((keyword) => {
        if (!keyword || keyword.trim() === '') {
          this.bugDetails = this.bugDetailsFromApi;
        } else {
          const filteredBugs = this.bugDetailsFromApi.filter((bug) => {
            return bug.title.toLowerCase().includes(keyword.toLowerCase());
          });

          this.bugDetails = filteredBugs;
        }
      });
  }


  private getBugs(limit:number){

    this.Service.getProjectBugs(
      this.project_id,
      this.currentPageNumber,
      limit
    ).subscribe({
      next: (response: any) => {
        console.log('ALl bugs', response);
        this.totalRecords = response.data.count;

        const bugs = response.data.rows.sort((a: any, b: any) =>
          a.id.toString().localeCompare(b.id.toString())
        );

        Promise.all(
          bugs.map(async (bug: any) => {
            const developerNames: string[] = [];
            const developersDetail: any[] = [];
            for (const devId of bug.developer_id) {
              try {
                const userRes: any = await lastValueFrom(
                  this.Service.getUserById(devId)
                );
                developersDetail.push(userRes.data);
                developerNames.push(userRes.data.name);
                console.log(developerNames);
                console.log(developersDetail);
              } catch (error) {
                console.error(error);
              }
            }

            return {
              ...bug,
              developerNames: developerNames.join(' - '),
              developersDetail: developersDetail,
            };
          })
        ).then((bugDet) => {
          this.bugDetailsFromApi = bugDet;
          this.bugDetails = bugDet;
        });
      },
      error: (err: any) => {
        console.log(err);
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }

  // page number get for pagination and get bugs

  onPageChange(event: PageEvent): void {
    this.currentPageNumber = event.pageIndex;
    this.Service.limitBug.next(event.pageSize || 1);
    this.totalRecords = event.length;

    this.getBugs(event.pageSize);
  }

  // get the selected id of bug and show the UI for choosing bug status
  showChangeStatus(chosenBug: any) {
    console.log(chosenBug);
    this.chosenBug = chosenBug;
  }

  // choose status get and update
  choosenStatus(id: any, status: any) {
    console.log(id, status);
    this.Service.changeStatus(this.project_id, status, id).subscribe({
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

  // delete bug 
  deleteBug(bug_id: any) {
    console.log(bug_id, this.project_id);
    this.Service.deleteBug(bug_id, this.project_id).subscribe({
      next: (response: any) => {
        this.ToastrService.success(response.message, 'Success');
      },
      error: (err) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
    this.chosenBug = '';
  }

  // add member to Project either QA or developer
  openAddMembersToProjectDialog() {
    console.log(this.assignBtn, '..........');

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

  // add bug dialog
  openAddBugDialog() {
    const dialogRef = this.dialog.open(AddBug, {
      backdropClass: 'popup',
      autoFocus: false,
      data: {
        projectId: this.project_id,
        dialogTitle: 'Add New Bug',
        btnName: 'Add',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // edit bug dialog
  openEditBugDialog(bug: any) {
    this.Service.isQABelongToBug(this.project_id, bug.id).subscribe({
      next: (res: any) => {
        console.log(res);

        const dialogRef = this.dialog.open(AddBug, {
          backdropClass: 'popup',
          autoFocus: false,
          data: {
            projectId: this.project_id,
            dialogTitle: 'Edit Bug',
            btnName: 'Edit',
            bugDetail: bug,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      },
      error: (err: any) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }
}
