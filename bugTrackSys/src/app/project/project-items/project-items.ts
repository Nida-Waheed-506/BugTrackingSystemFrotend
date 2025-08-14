import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project/project';
@Component({
  selector: 'app-project-items',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-items.html',
  styleUrl: './project-items.scss',
})
export class ProjectItems implements OnInit {
  @Input() page: any;
  limit: any;
  @Output() totalProjects = new EventEmitter<string>();
  constructor(
    private project_service: ProjectService,
    private ToastrService: ToastrService,
    private Router: Router
  ) {}
  projectDetails: any[] = [];
  ngOnInit() {
    this.project_service.projectsShownLimit.subscribe((value) => {
      this.limit = value;

      this.getProjects(this.limit);
    });

    this.getProjects(this.limit);

    this.project_service.projectsInfo$.subscribe((data) => {
      this.projectDetails = data;
    });
  }

  private getProjects(limit: number) {
    this.project_service.getProjects(this.page, limit).subscribe({
      next: (response: any) => {
        const projects = response.data[1].map((project: any) => {
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
        this.projectDetails = projects;
        this.project_service.projects$.next(projects);
        this.Router.navigate(['/projects']);
      },
      error: (err: any) => {
        this.ToastrService.error(err.error.error, 'Error');
      },
    });
  }
}
