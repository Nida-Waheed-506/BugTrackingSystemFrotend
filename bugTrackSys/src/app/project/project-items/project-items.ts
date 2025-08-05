import { Component, Input,Output , EventEmitter } from '@angular/core';
import { Data } from '../../services/data';
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
  @Input() limit : any;
  @Output() totalProjects = new EventEmitter<string>(); 
  constructor(private Data: Data , private ToastrService:ToastrService, private Router: Router) {}
  projectDetails: any[] = [];
  ngOnChanges() {

    console.log(this.page , this.limit)
    this.Data.getProjects(this.page,this.limit).subscribe({
        next: (response: any) => {
          this.totalProjects.emit(response.data[0]);
          this.Data.projectsInfo$.next(response.data[1]);

          //  this.ToastrService.success(response.message , "Success");
          this.Router.navigate(['/projects']);
        },
        error: (err:any) => {
          this.ToastrService.error(err.error.error, 'Error');
        },
      });;
    this.Data.projectsInfo$.subscribe((data) => {
      console.log(data);
      this.projectDetails = data;
    });
  }
}
