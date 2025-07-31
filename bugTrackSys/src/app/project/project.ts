import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { ProjectItems } from "./project-items/project-items";
import { MatDialog } from "@angular/material/dialog";
import { ProjectAdd } from './project-add/project-add';
@Component({
  selector: 'app-project',
  imports: [Navbar, ProjectItems],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class Project {
 constructor(public dialog: MatDialog) {}

  openDialog() {
   
    const dialogRef = this.dialog.open(ProjectAdd, {
      backdropClass: "popup",
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
