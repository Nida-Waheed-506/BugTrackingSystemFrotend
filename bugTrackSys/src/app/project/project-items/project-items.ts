import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Service } from '../../services/service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-items',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-items.html',
  styleUrl: './project-items.scss',
})
export class ProjectItems {
  @Input() page: any;
  limit: any;
  @Output() totalProjects = new EventEmitter<string>();
  constructor(
    private Service: Service,
    private ToastrService: ToastrService,
    private Router: Router
  ) {}
  projectDetails: any[] = [];
  ngOnInit() {
   
    this.Service.limitt.subscribe((value) => {
      this.limit = value;

      this.getProjects(this.limit);
    });

    this.getProjects(this.limit);

    this.Service.projectsInfo$.subscribe((data) => {
      console.log(data);
      this.projectDetails = data;
      // console.log(this.projectDetails[0]?.completedTasksCount);
    });
  }

  private getProjects(limit: number) {
    this.Service.getProjects(this.page, limit).subscribe({
      next: (response: any) => {
        const projects = response.data[1].map((project: any) => {
          console.log(project.Bugs);
          let projectTotalTasks = 0;
          let completedTasksCount = 0;
          projectTotalTasks = project.Bugs?.length;
          completedTasksCount = project.Bugs.filter(
            (bug: any) =>
              bug.status === 'resolved' || bug.status === 'completed'
          ).length;

          return {
            ...project,
            projectTotalTasks: projectTotalTasks,
            completedTasksCount: completedTasksCount,
          };
         
        });
     
        this.totalProjects.emit(response.data[0]);
        this.projectDetails = response.data[projects];
        this.Service.projectGetByApi$.next(projects);

        //  this.ToastrService.success(response.message , "Success");
        this.Router.navigate(['/projects']);
      },
      error: (err: any) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }
}
