import { Component } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { ProjectItems } from './project-items/project-items';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAdd } from './project-add/project-add';
import { Service } from '../services/service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

// ..............................imports ends ..................................


@Component({
  selector: 'app-project',
  imports: [Navbar, ProjectItems, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})

export class Project {

  // component variable

  loggedInUser: any | null = null;
  searchControl = new FormControl('');
  originalProjects: any[] = [];
  currentPageNumber: any = 0;
  limit : any ;
  totalRecords: any = 0;
  isManager: boolean = false;

  // constructor

  constructor(
    public dialog: MatDialog,
    private Service: Service,
    private ToasterService: ToastrService
  ) {}

  ngOnInit() {

     this.Service.limitt.subscribe((value)=>{
      
       this.limit = value;

     });

 
    // get the logged in user

    this.loggedInUser = this.Service.loggedInUserInfo$.pipe((user) => {
      return user;
    });


    // logged in users type check
    this.Service.loggedInUserInfo$.subscribe((user) => {
      
      if (user.user_type !== 'manager') this.isManager = true;
    });

   
 //  get projects 
    this.Service.projectGetByApi$.subscribe((projects) => {
      
      if (projects.length > 0) {
        this.originalProjects = [...projects];
        this.Service.projectsInfo$.next(projects);
      }
      // console.log(this.originalProjects);
    });

 // when filter by name the project.
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((keyword) => {
        console.log(this.originalProjects);
        if (!keyword || keyword.trim() === '') {
          this.Service.projectsInfo$.next(this.originalProjects);
          console.log(this.Service.projectsInfo$);
        } else {
         
          // console.log(this.originalProjects);
          const filteredProjects = this.originalProjects.filter((project) => {
            return project.projectName
              .toLowerCase()
              .includes(keyword.toLowerCase());
          });
          console.log(filteredProjects);
          this.Service.projectsInfo$.next(filteredProjects);
        }
      });
  }



  receiveDataFromChild(totProjects: string) {
    this.totalRecords = totProjects;
  }

  // page number get for pagination

  onPageChange(event: PageEvent): void {
    this.currentPageNumber = event.pageIndex;
    this.Service.limitt.next(event.pageSize || 1);
    this.totalRecords = event.length;
  }

  // sort by name
  onClickSortByName() {
    const sortedProjects = [...this.Service.projectsInfo$.getValue()].sort(
      (a, b) => a.projectName.localeCompare(b.projectName)
    );

    this.Service.projectsInfo$.next(sortedProjects);
  }
  // sory by date

  onClickSoryByDate() {
    const sortedProjects = [...this.Service.projectsInfo$.getValue()].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    console.log(sortedProjects);
    this.Service.projectsInfo$.next(sortedProjects);
  }

  // Project add dialog
  openDialog() {
    const dialogRef = this.dialog.open(ProjectAdd, {
      backdropClass: 'popup',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
