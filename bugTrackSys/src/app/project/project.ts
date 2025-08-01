import { Component } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { ProjectItems } from './project-items/project-items';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAdd } from './project-add/project-add';
import { Data } from '../services/data';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-project',
  imports: [Navbar, ProjectItems, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  loggedInUser: any | null = null;
  searchControl = new FormControl('');
  originalProjects: any[] = [];
  constructor(
    public dialog: MatDialog,
    private Data: Data,
    private ToasterService: ToastrService
  ) {}

  ngOnInit() {
    this.loggedInUser = this.Data.loggedInUserInfo$.pipe((user) => {
      return user;
    });

    // when filter by name the project.

    this.Data.projectsInfo$.subscribe((projects) => {
      if (projects.length > 0 && this.originalProjects.length === 0) {
        this.originalProjects = [...projects];
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((keyword) => {
        console.log(keyword);
        if (!keyword || keyword.trim() === '') {
          this.Data.projectsInfo$.next(this.originalProjects);
          console.log(this.Data.projectsInfo$);
        } else {
          console.log('nida');
          const filteredProjects = this.originalProjects.filter((project) => {
            return project.projectName
              .toLowerCase()
              .includes(keyword.toLowerCase());
          });
          this.Data.projectsInfo$.next(filteredProjects);
        }
      });
  }

  // sort by name
  onClickSortByName() {
    const sortedProjects = [...this.Data.projectsInfo$.getValue()].sort(
      (a, b) => a.projectName.localeCompare(b.projectName)
    );

    this.Data.projectsInfo$.next(sortedProjects);
  }
  // sory by date

  onClickSoryByDate() {
    const sortedProjects = [...this.Data.projectsInfo$.getValue()].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    this.Data.projectsInfo$.next(sortedProjects);
  }

  openDialog() {
    if (this.loggedInUser._value.user_type === 'manager') {
      const dialogRef = this.dialog.open(ProjectAdd, {
        backdropClass: 'popup',
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      this.ToasterService.error(
        'Only manager can perform this action',
        'Error'
      );
    }
  }
}
