import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { MatDialog } from '@angular/material/dialog';
import { AssignedProjectMembers } from './assigned-project-members/assigned-project-members';
import { AddBug } from './add-bug/add-bug';
import { ActivatedRoute , ParamMap } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bug',
  imports: [Navbar  ],
  templateUrl: './bug.html',
  styleUrl: './bug.scss'
})
export class Bug {
project_id  : string | null = null;
constructor(public dialog: MatDialog , private route:ActivatedRoute , private router:Router) {}

ngOnInit(){
 this.route.paramMap.subscribe((params:ParamMap)=>{
 
 this.project_id = params.get('project_id');


})
}
openAddMembersToProjectDialog(){
  this.router.navigate([`/projects/${this.project_id}/assign`]);
  const dialogRef = this.dialog.open(AssignedProjectMembers, {
    backdropClass: "popup",
    autoFocus: false
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

openAddBugDialog(){
 const dialogRef = this.dialog.open(AddBug, {
      backdropClass: "popup",
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
}
}
