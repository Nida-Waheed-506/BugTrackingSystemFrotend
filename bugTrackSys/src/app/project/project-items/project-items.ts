import { Component } from "@angular/core";
import { Data } from "../../services/data";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Router } from "express";
@Component({
  selector: "app-project-items",
  imports: [CommonModule , RouterLink],
  templateUrl: "./project-items.html",
  styleUrl: "./project-items.scss",
})
export class ProjectItems {
  constructor(private Data: Data) {}
 projectDetails: any[] = [];
  ngOnInit() {
    this.Data.getProjects();
    this.Data.projectsInfo$.subscribe((data) => {
    this.projectDetails = data;
  });
  console.log(this.projectDetails);
}
}
